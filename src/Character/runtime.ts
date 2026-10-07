import type { ObjectId } from '../scene/objects'
import type { Point } from '../scene/nav'
import { CHARACTER_START } from '../scene/layout'

export type OneShot = 'wave' | 'reach' | 'stretch' | 'phone' | 'sip'

/** Mutable character state, read and written every frame by the controller. */
export const char = {
  x: CHARACTER_START.x,
  z: CHARACTER_START.z,
  heading: CHARACTER_START.heading,
  targetHeading: CHARACTER_START.heading,
  /** Smoothed planar speed, used to blend idle and walk. */
  speed: 0,
  path: [] as Point[],
  /** Object to use when the current path ends. */
  pending: null as ObjectId | null,
  sitting: false,
  oneShot: null as OneShot | null,
  oneShotUntil: 0,
  afterOneShot: null as (() => void) | null,
  /** Keyboard direction in screen space (x right, y up). */
  keys: { x: 0, y: 0 },
  /** Joystick direction in screen space, magnitude 0..1. */
  stick: { x: 0, y: 0 },
  lastActivity: 0,
}
