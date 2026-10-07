/**
 * One pooled particle system for every little puff in the room: footstep dust,
 * coffee steam, plant leaves and cat hearts. Call spawnPuff() from anywhere.
 */

export const MAX_PUFFS = 80

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  age: number
  life: number
  size: number
}

export const pool: Particle[] = Array.from({ length: MAX_PUFFS }, () => ({
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  age: 1,
  life: 0,
  size: 0,
}))
export const pendingColors: { index: number; color: string }[] = []
let cursor = 0

interface PuffOptions {
  count?: number
  color?: string
  size?: number
  spread?: number
  rise?: number
  life?: number
}

export function spawnPuff(
  x: number,
  y: number,
  z: number,
  {
    count = 1,
    color = '#fffaf0',
    size = 0.07,
    spread = 0.25,
    rise = 0.35,
    life = 0.7,
  }: PuffOptions = {},
) {
  for (let n = 0; n < count; n++) {
    const p = pool[cursor]
    const a = Math.random() * Math.PI * 2
    const s = spread * (0.4 + Math.random() * 0.6)
    Object.assign(p, {
      x,
      y,
      z,
      vx: Math.cos(a) * s,
      vy: rise * (0.6 + Math.random() * 0.6),
      vz: Math.sin(a) * s,
      age: 0,
      life: life * (0.75 + Math.random() * 0.5),
      size: size * (0.7 + Math.random() * 0.6),
    })
    pendingColors.push({ index: cursor, color })
    cursor = (cursor + 1) % MAX_PUFFS
  }
}
