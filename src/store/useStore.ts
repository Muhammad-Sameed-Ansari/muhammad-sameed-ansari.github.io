import { create } from 'zustand'
import { hasWebGL } from '../lib/media'
import type { EasterEgg, ObjectId, Section } from '../scene/objects'

interface Speech {
  text: string
  id: number
}

export type ViewMode = 'room' | 'classic'

interface State {
  /** 'classic' is the plain, fast, accessible single-page version. */
  mode: ViewMode
  /** Loading progress, 0 to 1. */
  progress: number
  /** The visitor pressed "Enter my room". */
  entered: boolean
  panel: Section | null
  /** What the camera is framing. 'projects' means the laptop close-up. */
  focus: ObjectId | null
  /** Interactive object the character is standing next to. */
  nearId: ObjectId | null
  /** Interactive object under the pointer. */
  hoverId: ObjectId | null
  night: boolean
  lampOn: boolean
  sound: boolean
  joystick: boolean
  helpOpen: boolean
  hasMoved: boolean
  speech: Speech | null
  /** Bumped each time an easter egg is triggered, so its 3D object can react. */
  pokes: Record<EasterEgg, number>

  setMode: (mode: ViewMode) => void
  setProgress: (p: number) => void
  enter: () => void
  openPanel: (s: Section) => void
  closePanel: () => void
  setFocus: (f: ObjectId | null) => void
  setNear: (id: ObjectId | null) => void
  setHover: (id: ObjectId | null) => void
  toggleNight: () => void
  toggleLamp: () => void
  toggleSound: () => void
  toggleJoystick: () => void
  setHelpOpen: (open: boolean) => void
  markMoved: () => void
  say: (text: string, ms?: number) => void
  poke: (egg: EasterEgg) => void
}

let speechTimer: ReturnType<typeof setTimeout> | undefined

const initialMode = (): ViewMode =>
  new URLSearchParams(window.location.search).get('view') === 'classic' || !hasWebGL()
    ? 'classic'
    : 'room'

export const useStore = create<State>()((set, get) => ({
  mode: initialMode(),
  progress: 0,
  entered: false,
  panel: null,
  focus: null,
  nearId: null,
  hoverId: null,
  night: false,
  lampOn: false,
  sound: false,
  joystick: false,
  helpOpen: false,
  hasMoved: false,
  speech: null,
  pokes: { window: 0, plant: 0, cat: 0, mug: 0, lamp: 0 },

  setMode: (mode) => {
    const url = new URL(window.location.href)
    if (mode === 'classic') url.searchParams.set('view', 'classic')
    else url.searchParams.delete('view')
    window.history.pushState(null, '', url)
    window.scrollTo(0, 0)
    set({ mode, panel: null, focus: null })
  },
  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  enter: () => set({ entered: true }),
  openPanel: (panel) => set({ panel, speech: null }),
  closePanel: () => set({ panel: null, focus: null }),
  setFocus: (focus) => set({ focus }),
  setNear: (nearId) => set({ nearId }),
  setHover: (hoverId) => set({ hoverId }),
  toggleNight: () => set((s) => ({ night: !s.night, lampOn: !s.night })),
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  toggleJoystick: () => set((s) => ({ joystick: !s.joystick })),
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  markMoved: () => {
    if (!get().hasMoved) set({ hasMoved: true })
  },
  say: (text, ms = 3200) => {
    clearTimeout(speechTimer)
    set({ speech: { text, id: Date.now() } })
    speechTimer = setTimeout(() => set({ speech: null }), ms)
  },
  poke: (egg) => set((s) => ({ pokes: { ...s.pokes, [egg]: s.pokes[egg] + 1 } })),
}))
