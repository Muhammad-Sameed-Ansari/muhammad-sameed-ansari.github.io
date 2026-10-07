/**
 * Procedural animation. Each clip is a function of time that returns a pose (joint
 * angles plus body offsets). The controller cross-fades clip weights every frame and
 * applies the weighted average, which gives smooth blends between any two clips.
 *
 * Angle conventions (character faces +z): a negative X rotation swings a limb forward,
 * a negative Z rotation lifts the right arm (on -x) outward.
 */

export interface Pose {
  y: number
  lean: number
  sway: number
  twist: number
  squash: number
  headX: number
  headY: number
  headZ: number
  armLX: number
  armLZ: number
  armRX: number
  armRZ: number
  legLX: number
  legRX: number
}

export type Clip = 'idle' | 'walk' | 'sit' | 'wave' | 'reach' | 'stretch' | 'phone' | 'sip'

export const CLIPS: Clip[] = ['idle', 'walk', 'sit', 'wave', 'reach', 'stretch', 'phone', 'sip']

const base = (): Pose => ({
  y: 0,
  lean: 0,
  sway: 0,
  twist: 0,
  squash: 1,
  headX: 0,
  headY: 0,
  headZ: 0,
  armLX: 0,
  armLZ: 0.12,
  armRX: 0,
  armRZ: -0.12,
  legLX: 0,
  legRX: 0,
})

const { sin, abs, cos } = Math

/** Seat height relative to the character's hips, so the body rests on the chair. */
const SIT_LIFT = 0.12

export const clips: Record<Clip, (t: number, phase: number) => Pose> = {
  idle: (t) => {
    const p = base()
    const breath = sin(t * 2.1)
    p.squash = 1 + breath * 0.018
    p.armLZ = 0.14 + breath * 0.03
    p.armRZ = -0.14 - breath * 0.03
    // Occasional slow look-around.
    p.headY = sin(t * 0.41) * sin(t * 0.17) * 0.55
    p.headX = sin(t * 0.33) * 0.06
    p.headZ = sin(t * 0.7) * 0.04
    return p
  },

  walk: (_t, phase) => {
    const p = base()
    const s = sin(phase)
    const contact = abs(s) ** 3
    p.legLX = s * 0.75
    p.legRX = -s * 0.75
    p.armLX = -s * 0.65
    p.armRX = s * 0.65
    p.armLZ = 0.18
    p.armRZ = -0.18
    p.y = 0.07 * (1 - contact)
    p.squash = 1 - 0.07 * contact + 0.04 * (1 - contact)
    p.lean = 0.12
    p.sway = cos(phase) * 0.05
    p.twist = s * 0.08
    p.headX = -0.06
    return p
  },

  sit: (t) => {
    const p = base()
    p.y = SIT_LIFT
    p.legLX = -1.45
    p.legRX = -1.45
    // Typing: arms forward with fast alternating taps.
    p.armLX = -1.15 + sin(t * 17) * 0.06
    p.armRX = -1.15 + sin(t * 17 + 1.7) * 0.06
    p.armLZ = -0.12
    p.armRZ = 0.12
    p.lean = 0.12
    p.headX = 0.12 + sin(t * 0.9) * 0.03
    p.headY = sin(t * 0.5) * 0.1
    p.squash = 1 + sin(t * 2) * 0.01
    return p
  },

  wave: (t) => {
    const p = base()
    p.armRZ = -2.65 + sin(t * 13) * 0.32
    p.armRX = -0.15
    p.armLZ = 0.25
    p.sway = sin(t * 6.5) * 0.06
    p.headZ = 0.14
    p.headX = -0.08
    p.squash = 1 + abs(sin(t * 6.5)) * 0.04
    return p
  },

  reach: (t) => {
    const p = base()
    p.armRX = -1.55 + sin(t * 8) * 0.05
    p.armLX = -0.35
    p.lean = 0.2
    p.headX = 0.08
    p.squash = 1.03
    return p
  },

  stretch: (t) => {
    const p = base()
    const s = (sin(t * 2.4) + 1) / 2
    p.armRZ = -2.8 - s * 0.2
    p.armLZ = 2.8 + s * 0.2
    p.squash = 1.04 + s * 0.06
    p.headX = -0.35
    p.sway = sin(t * 1.2) * 0.08
    return p
  },

  phone: (t) => {
    const p = base()
    p.armRX = -2.0
    p.armRZ = 0.45
    p.armLZ = 0.15
    p.headX = 0.3
    p.headY = sin(t * 0.8) * 0.05
    p.lean = 0.05
    return p
  },

  sip: (t) => {
    const p = base()
    const tilt = (sin(t * 1.6) + 1) / 2
    p.armRX = -2.2 - tilt * 0.35
    p.armRZ = 0.55
    p.headX = -0.1 - tilt * 0.2
    p.squash = 1 + tilt * 0.02
    return p
  },
}

export function blendPoses(poses: Pose[], weights: number[], out: Pose): Pose {
  let total = 0
  for (const w of weights) total += w
  const keys = Object.keys(out) as (keyof Pose)[]
  for (const k of keys) {
    let v = 0
    for (let i = 0; i < poses.length; i++) v += poses[i][k] * weights[i]
    out[k] = total > 0 ? v / total : 0
  }
  return out
}

export const emptyPose = base
