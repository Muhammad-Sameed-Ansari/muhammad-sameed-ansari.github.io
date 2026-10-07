/**
 * Room layout in world units (1 unit ≈ the character's height).
 * The floor spans x ∈ [-5, 5] and z ∈ [-4, 4]. The back wall sits at z = -4 and the
 * left wall at x = -5; the front and right sides are open like a diorama.
 */
export const ROOM = {
  minX: -5,
  maxX: 5,
  minZ: -4,
  maxZ: 4,
  wallHeight: 3.4,
  wallThickness: 0.2,
} as const

export const ROOM_CENTER = { x: 0, z: 0 }

/** Axis-aligned footprint on the floor that the character cannot walk through. */
export interface Footprint {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

const box = (x: number, z: number, w: number, d: number): Footprint => ({
  minX: x - w / 2,
  maxX: x + w / 2,
  minZ: z - d / 2,
  maxZ: z + d / 2,
})

export const DESK = { x: -0.2, z: -3.45, w: 2.6, d: 1.0, h: 0.62 }
export const LAPTOP = { x: -0.45, z: -3.3 }
/** Where the character sits, and where the chair rests when nobody is sitting. */
export const SIT_SPOT = { x: -0.45, z: -2.62 }
export const CHAIR_PARKED = { x: 0.6, z: -2.2, rot: -0.7 }
export const PC_TOWER = { x: 1.6, z: -3.5, w: 0.5, d: 0.85, h: 1.0 }
export const WINDOW = { x: 3.1, y: 1.95, w: 1.9, h: 1.6 }
export const PLANT = { x: 4.45, z: -3.45 }
export const CLOCK = { x: -0.2, y: 2.65 }
export const BOOKSHELF = { x: -4.72, z: -2.45, w: 1.7, d: 0.56, h: 2.35 }
export const MIRROR = { x: -3.0, z: -3.72 }
export const CORKBOARD = { z: -0.05, y: 1.85, w: 2.1, h: 1.35 }
export const DOOR = { z: 2.75, w: 1.15, h: 2.25 }
export const SIDE_TABLE = { x: -4.62, z: 1.45 }
export const RUG = { x: 0.6, z: 0.4, w: 4.4, d: 3.2 }
export const CAT_BED = { x: 2.7, z: 1.7 }
export const BEANBAG = { x: 3.9, z: 0.1 }

export const CHARACTER_START = { x: 1.0, z: 0.6, heading: 0.5 }
export const CHARACTER_RADIUS = 0.3

export const FOOTPRINTS: Footprint[] = [
  box(DESK.x, DESK.z, DESK.w, DESK.d),
  box(CHAIR_PARKED.x, CHAIR_PARKED.z, 0.55, 0.55),
  box(PC_TOWER.x, PC_TOWER.z, PC_TOWER.w, PC_TOWER.d),
  box(PLANT.x, PLANT.z, 0.7, 0.7),
  box(BOOKSHELF.x, BOOKSHELF.z, BOOKSHELF.d, BOOKSHELF.w),
  box(MIRROR.x, MIRROR.z, 0.9, 0.5),
  box(SIDE_TABLE.x, SIDE_TABLE.z, 0.62, 0.62),
  box(CAT_BED.x, CAT_BED.z, 1.0, 1.0),
  box(BEANBAG.x, BEANBAG.z, 1.1, 1.1),
]
