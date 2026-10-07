import { RBox } from '../scene/primitives'
import { ROOM, WINDOW } from '../scene/layout'

const FRAME = '#fff6ec'
const CURTAIN = '#ffb8c6'

/** Window frame, mullions, sill and curtains. The view outside lives in <Outside />. */
export function WindowFrame() {
  const { w, h, x, y } = WINDOW
  const z = ROOM.minZ
  const bar = 0.1
  return (
    <group position={[x, y, z]}>
      <RBox size={[w + bar * 2, bar, 0.16]} color={FRAME} position={[0, h / 2 + bar / 2, 0.02]} />
      <RBox size={[w + bar * 2, bar, 0.16]} color={FRAME} position={[0, -h / 2 - bar / 2, 0.02]} />
      <RBox size={[bar, h, 0.16]} color={FRAME} position={[-w / 2 - bar / 2, 0, 0.02]} />
      <RBox size={[bar, h, 0.16]} color={FRAME} position={[w / 2 + bar / 2, 0, 0.02]} />
      <RBox size={[0.05, h, 0.06]} radius={0.02} color={FRAME} position={[0, 0, -0.06]} />
      <RBox size={[w, 0.05, 0.06]} radius={0.02} color={FRAME} position={[0, 0, -0.06]} />
      {/* Sill */}
      <RBox size={[w + 0.4, 0.08, 0.32]} color={FRAME} position={[0, -h / 2 - 0.13, 0.12]} />
      {/* Curtain rod and curtains */}
      <RBox
        size={[w + 1.1, 0.05, 0.05]}
        radius={0.02}
        color="#d68c6e"
        position={[0, h / 2 + 0.28, 0.22]}
      />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (w / 2 + 0.28), 0.12, 0.22]}>
          <RBox size={[0.42, h + 0.32, 0.12]} radius={0.06} color={CURTAIN} castShadow />
          <RBox size={[0.46, 0.1, 0.16]} radius={0.04} color="#ff8fa5" position={[0, -0.35, 0]} />
        </group>
      ))}
    </group>
  )
}
