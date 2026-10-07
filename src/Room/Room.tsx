import { Outlines } from '@react-three/drei'
import { INK } from '../scene/toon'
import { RBox, Toon } from '../scene/primitives'
import { floorTexture } from '../scene/textures'
import { ROOM, RUG, WINDOW } from '../scene/layout'
import { FairyLights } from './FairyLights'

const WALL = '#fbe0cf'
const WALL_SIDE = '#f6d2be'
const WAINSCOT = '#f2b9a2'
const TRIM = '#fff6ec'
const WALL_TOP = '#e79f86'

/** A plain wall slab with an outline. Coordinates are min/max corners. */
function Slab({
  from,
  to,
  color,
  outline = 0.02,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  outline?: number | false
}) {
  const size: [number, number, number] = [to[0] - from[0], to[1] - from[1], to[2] - from[2]]
  const pos: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ]
  return (
    <mesh position={pos} receiveShadow>
      <boxGeometry args={size} />
      <Toon color={color} />
      {outline !== false && <Outlines thickness={outline} color={INK} />}
    </mesh>
  )
}

export function Room() {
  const { minX, maxX, minZ, maxZ, wallHeight: H, wallThickness: T } = ROOM
  const winL = WINDOW.x - WINDOW.w / 2
  const winR = WINDOW.x + WINDOW.w / 2
  const winB = WINDOW.y - WINDOW.h / 2
  const winT = WINDOW.y + WINDOW.h / 2
  const wainscotH = 0.95

  return (
    <group>
      {/* Floor and diorama base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[maxX - minX, maxZ - minZ]} />
        <Toon color="#ffffff" map={floorTexture()} />
      </mesh>
      <Slab
        from={[minX - T, -0.36, minZ - T]}
        to={[maxX + 0.08, -0.001, maxZ + 0.08]}
        color="#d9a07a"
      />
      <Slab
        from={[minX - T - 0.1, -0.5, minZ - T - 0.1]}
        to={[maxX + 0.18, -0.36, maxZ + 0.18]}
        color="#b98ab8"
      />

      {/* Back wall, built around the window opening */}
      <Slab from={[minX - T, 0, minZ - T]} to={[winL, H, minZ]} color={WALL} />
      <Slab from={[winR, 0, minZ - T]} to={[maxX, H, minZ]} color={WALL} />
      <Slab from={[winL, 0, minZ - T]} to={[winR, winB, minZ]} color={WALL} outline={false} />
      <Slab from={[winL, winT, minZ - T]} to={[winR, H, minZ]} color={WALL} outline={false} />
      {/* Left wall */}
      <Slab from={[minX - T, 0, minZ]} to={[minX, H, maxZ]} color={WALL_SIDE} />
      {/* Wall tops read as the cut edge of the diorama */}
      <Slab
        from={[minX - T, H, minZ - T]}
        to={[maxX, H + 0.04, minZ]}
        color={WALL_TOP}
        outline={false}
      />
      <Slab
        from={[minX - T, H, minZ]}
        to={[minX, H + 0.04, maxZ]}
        color={WALL_TOP}
        outline={false}
      />

      {/* Wainscoting, chair rail and baseboards */}
      <Slab
        from={[minX, 0, minZ]}
        to={[maxX, wainscotH, minZ + 0.03]}
        color={WAINSCOT}
        outline={false}
      />
      <Slab
        from={[minX, 0, minZ]}
        to={[minX + 0.03, wainscotH, maxZ]}
        color={WAINSCOT}
        outline={false}
      />
      <Slab
        from={[minX, wainscotH, minZ]}
        to={[maxX, wainscotH + 0.06, minZ + 0.06]}
        color={TRIM}
        outline={0.012}
      />
      <Slab
        from={[minX, wainscotH, minZ]}
        to={[minX + 0.06, wainscotH + 0.06, maxZ]}
        color={TRIM}
        outline={0.012}
      />
      <Slab from={[minX, 0, minZ]} to={[maxX, 0.14, minZ + 0.06]} color={TRIM} outline={0.012} />
      <Slab from={[minX, 0, minZ]} to={[minX + 0.06, 0.14, maxZ]} color={TRIM} outline={0.012} />

      <FairyLights />

      {/* Rug */}
      <RBox
        size={[RUG.w, 0.04, RUG.d]}
        radius={0.02}
        color="#a8dcc9"
        position={[RUG.x, 0.02, RUG.z]}
        receiveShadow
      />
      <RBox
        size={[RUG.w - 0.5, 0.045, RUG.d - 0.5]}
        radius={0.02}
        color="#fff3df"
        outline={0.01}
        position={[RUG.x, 0.022, RUG.z]}
        receiveShadow
      />
      <RBox
        size={[RUG.w - 0.9, 0.05, RUG.d - 0.9]}
        radius={0.02}
        color="#ffc8b4"
        outline={0.01}
        position={[RUG.x, 0.024, RUG.z]}
        receiveShadow
      />
    </group>
  )
}
