import { CHARACTER_RADIUS, FOOTPRINTS, ROOM } from './layout'

/**
 * Navigation for the character: a walkability grid built from furniture footprints,
 * A* pathfinding with path smoothing for click-to-move, and sliding collision for
 * keyboard/joystick movement. The room is static, so this is all computed once.
 */

export interface Point {
  x: number
  z: number
}

const CELL = 0.2
const WALL_MARGIN = 0.34
const BOUNDS = {
  minX: ROOM.minX + WALL_MARGIN,
  maxX: ROOM.maxX - WALL_MARGIN,
  minZ: ROOM.minZ + WALL_MARGIN,
  maxZ: ROOM.maxZ - WALL_MARGIN,
}
const COLS = Math.floor((BOUNDS.maxX - BOUNDS.minX) / CELL) + 1
const ROWS = Math.floor((BOUNDS.maxZ - BOUNDS.minZ) / CELL) + 1

const OBSTACLES = FOOTPRINTS.map((f) => ({
  minX: f.minX - CHARACTER_RADIUS,
  maxX: f.maxX + CHARACTER_RADIUS,
  minZ: f.minZ - CHARACTER_RADIUS,
  maxZ: f.maxZ + CHARACTER_RADIUS,
}))

export function isWalkable(x: number, z: number) {
  if (x < BOUNDS.minX || x > BOUNDS.maxX || z < BOUNDS.minZ || z > BOUNDS.maxZ) return false
  for (const o of OBSTACLES) {
    if (x > o.minX && x < o.maxX && z > o.minZ && z < o.maxZ) return false
  }
  return true
}

const cellX = (i: number) => BOUNDS.minX + (i % COLS) * CELL
const cellZ = (i: number) => BOUNDS.minZ + Math.floor(i / COLS) * CELL

const walkable = new Uint8Array(COLS * ROWS)
for (let i = 0; i < walkable.length; i++) walkable[i] = isWalkable(cellX(i), cellZ(i)) ? 1 : 0

function nearestWalkableCell(p: Point) {
  const c = Math.round((p.x - BOUNDS.minX) / CELL)
  const r = Math.round((p.z - BOUNDS.minZ) / CELL)
  let best = -1
  let bestD = Infinity
  // Expanding square search; the grid is tiny so this is cheap.
  for (let radius = 0; radius < Math.max(COLS, ROWS) && best < 0; radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== radius) continue
        const cc = c + dc
        const rr = r + dr
        if (cc < 0 || rr < 0 || cc >= COLS || rr >= ROWS) continue
        const i = rr * COLS + cc
        if (!walkable[i]) continue
        const d = (cellX(i) - p.x) ** 2 + (cellZ(i) - p.z) ** 2
        if (d < bestD) {
          bestD = d
          best = i
        }
      }
    }
  }
  return best
}

/** Returns the closest walkable point to p (p itself if it is walkable). */
export function clampToWalkable(p: Point): Point {
  if (isWalkable(p.x, p.z)) return p
  const i = nearestWalkableCell(p)
  return { x: cellX(i), z: cellZ(i) }
}

function lineOfSight(a: Point, b: Point) {
  const dist = Math.hypot(b.x - a.x, b.z - a.z)
  const steps = Math.ceil(dist / 0.08)
  for (let s = 1; s < steps; s++) {
    const t = s / steps
    if (!isWalkable(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)) return false
  }
  return true
}

const NEIGHBORS = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
] as const

/** A* over the grid, then string-pulled so the character walks in straight lines. */
export function findPath(from: Point, to: Point): Point[] {
  const target = clampToWalkable(to)
  if (lineOfSight(from, target)) return [target]

  const start = nearestWalkableCell(from)
  const goal = nearestWalkableCell(target)
  const gx = goal % COLS
  const gz = Math.floor(goal / COLS)
  const h = (i: number) => Math.hypot((i % COLS) - gx, Math.floor(i / COLS) - gz)

  const g = new Float32Array(COLS * ROWS).fill(Infinity)
  const came = new Int32Array(COLS * ROWS).fill(-1)
  const closed = new Uint8Array(COLS * ROWS)
  const open: number[] = [start]
  const f = new Float32Array(COLS * ROWS).fill(Infinity)
  g[start] = 0
  f[start] = h(start)

  while (open.length) {
    let bi = 0
    for (let k = 1; k < open.length; k++) if (f[open[k]] < f[open[bi]]) bi = k
    const cur = open[bi]
    open.splice(bi, 1)
    if (cur === goal) break
    closed[cur] = 1
    const cx = cur % COLS
    const cz = Math.floor(cur / COLS)
    for (const [dx, dz, cost] of NEIGHBORS) {
      const nx = cx + dx
      const nz = cz + dz
      if (nx < 0 || nz < 0 || nx >= COLS || nz >= ROWS) continue
      const n = nz * COLS + nx
      if (!walkable[n] || closed[n]) continue
      // No cutting corners around furniture.
      if (dx && dz && (!walkable[cz * COLS + nx] || !walkable[nz * COLS + cx])) continue
      const ng = g[cur] + cost
      if (ng < g[n]) {
        if (g[n] === Infinity) open.push(n)
        g[n] = ng
        f[n] = ng + h(n)
        came[n] = cur
      }
    }
  }

  if (came[goal] < 0 && goal !== start) return []

  const cells: Point[] = []
  for (let i = goal; i >= 0; i = came[i]) cells.unshift({ x: cellX(i), z: cellZ(i) })
  cells[cells.length - 1] = target

  // String pulling: skip waypoints that are directly visible.
  const path: Point[] = []
  let anchor = from
  let k = 0
  while (k < cells.length) {
    let far = k
    for (let j = cells.length - 1; j > k; j--) {
      if (lineOfSight(anchor, cells[j])) {
        far = j
        break
      }
    }
    path.push(cells[far])
    anchor = cells[far]
    k = far + 1
  }
  return path
}

/** Moves p by (dx, dz), sliding along walls and furniture instead of stopping dead. */
export function moveWithCollision(p: Point, dx: number, dz: number): Point {
  let { x, z } = p
  if (isWalkable(x + dx, z)) x += dx
  if (isWalkable(x, z + dz)) z += dz
  return { x, z }
}
