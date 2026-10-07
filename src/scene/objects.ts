import {
  BOOKSHELF,
  CAT_BED,
  CORKBOARD,
  MIRROR,
  PLANT,
  SIDE_TABLE,
  SIT_SPOT,
  WINDOW,
} from './layout'

export type Section = 'projects' | 'skills' | 'experience' | 'about' | 'contact'
export type EasterEgg = 'window' | 'plant' | 'cat' | 'mug' | 'lamp'
export type ObjectId = Section | EasterEgg

type Vec3 = [number, number, number]

export interface RoomObject {
  id: ObjectId
  label: string
  emoji: string
  section?: Section
  /** Where the character stands to use it, and which way it faces. Desk-top props have none. */
  interact?: { x: number; z: number; heading: number }
  /** World position of the floating proximity label. */
  labelPos: Vec3
  /** Camera focus while the section is open. */
  focus?: { target: Vec3; distance: number }
}

const FACE_BACK = Math.PI
const FACE_LEFT = -Math.PI / 2

export const OBJECTS: Record<ObjectId, RoomObject> = {
  projects: {
    id: 'projects',
    label: 'Projects',
    emoji: '💻',
    section: 'projects',
    interact: { x: SIT_SPOT.x, z: SIT_SPOT.z + 0.35, heading: FACE_BACK },
    labelPos: [-0.45, 1.5, -3.3],
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    emoji: '📚',
    section: 'skills',
    interact: { x: -3.8, z: BOOKSHELF.z, heading: FACE_LEFT },
    labelPos: [-4.6, 2.85, BOOKSHELF.z],
    focus: { target: [-4.4, 1.3, BOOKSHELF.z], distance: 0.62 },
  },
  experience: {
    id: 'experience',
    label: 'Experience',
    emoji: '📌',
    section: 'experience',
    interact: { x: -4.15, z: CORKBOARD.z, heading: FACE_LEFT },
    labelPos: [-4.8, 2.85, CORKBOARD.z],
    focus: { target: [-4.6, 1.6, CORKBOARD.z], distance: 0.62 },
  },
  about: {
    id: 'about',
    label: 'About me',
    emoji: '🪞',
    section: 'about',
    interact: { x: MIRROR.x, z: -2.85, heading: FACE_BACK },
    labelPos: [MIRROR.x, 2.25, MIRROR.z],
    focus: { target: [MIRROR.x, 1.1, -3.4], distance: 0.62 },
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    emoji: '☎️',
    section: 'contact',
    interact: { x: -3.85, z: SIDE_TABLE.z, heading: FACE_LEFT },
    labelPos: [SIDE_TABLE.x, 1.35, SIDE_TABLE.z],
    focus: { target: [-4.4, 1.0, 2.0], distance: 0.62 },
  },
  window: {
    id: 'window',
    label: 'Day / night',
    emoji: '🪟',
    interact: { x: WINDOW.x, z: -2.95, heading: FACE_BACK },
    labelPos: [WINDOW.x, WINDOW.y + WINDOW.h / 2 + 0.35, -3.9],
  },
  plant: {
    id: 'plant',
    label: 'Plant',
    emoji: '🪴',
    interact: { x: 3.85, z: -2.55, heading: 0.75 + Math.PI },
    labelPos: [PLANT.x, 1.85, PLANT.z],
  },
  cat: {
    id: 'cat',
    label: 'Pet the cat',
    emoji: '🐈',
    interact: { x: CAT_BED.x - 0.15, z: CAT_BED.z - 0.95, heading: 0 },
    labelPos: [CAT_BED.x, 0.95, CAT_BED.z],
  },
  mug: { id: 'mug', label: 'Coffee', emoji: '☕', labelPos: [0.3, 1.0, -3.1] },
  lamp: { id: 'lamp', label: 'Lamp', emoji: '💡', labelPos: [-1.25, 1.55, -3.65] },
}

/** Order used by quick-nav and the classic view. */
export const SECTIONS: Section[] = ['projects', 'skills', 'experience', 'about', 'contact']
export const EASTER_EGGS: EasterEgg[] = ['window', 'cat', 'plant', 'mug', 'lamp']
