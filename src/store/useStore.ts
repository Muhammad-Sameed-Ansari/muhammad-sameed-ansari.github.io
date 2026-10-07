import { create } from 'zustand'
import type { EasterEgg, ObjectId, Section } from '../scene/objects'

interface Speech {
  text: string
  id: number
}

interface State {
  /** Loading progress, 0 to 1. */
  progress: number
  /** The visitor pressed "Enter my room". */
  entered: boolean
  panel: Section | null
  /** What the camera is framing. 'projects' means the laptop close-up. */
  focus: ObjectId | null
  /** Interactive object the character is standing next to. */
  nearId: ObjectId | null
  night: boolean
  lampOn: boolean
  sound: boolean
  joystick: boolean
  helpOpen: boolean
  hasMoved: boolean
  speech: Speech | null
  /** Bumped each time an easter egg is triggered, so its 3D object can react. */
  pokes: Record<EasterEgg, number>

  setProgress: (p: number) => void
  enter: () => void
  openPanel: (s: Section) => void
  closePanel: () => void
  setFocus: (f: ObjectId | null) => void
  setNear: (id: ObjectId | null) => void
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

export const useStore = create<State>()((set, get) => ({
  progress: 0,
  entered: false,
  panel: null,
  focus: null,
  nearId: null,
  night: false,
  lampOn: false,
  sound: false,
  joystick: false,
  helpOpen: false,
  hasMoved: false,
  speech: null,
  pokes: { window: 0, plant: 0, cat: 0, mug: 0, lamp: 0 },

  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  enter: () => set({ entered: true }),
  openPanel: (panel) => set({ panel, speech: null }),
  closePanel: () => set({ panel: null, focus: null }),
  setFocus: (focus) => set({ focus }),
  setNear: (nearId) => set({ nearId }),
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
