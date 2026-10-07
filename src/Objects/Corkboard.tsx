import { CORKBOARD, ROOM } from '../scene/layout'
import { Ball, RBox } from '../scene/primitives'
import { Interactive } from './Interactive'

const NOTES: { x: number; y: number; color: string; rot: number }[] = [
  { x: -0.72, y: 0.3, color: '#ffd166', rot: 0.08 },
  { x: -0.25, y: -0.18, color: '#9fd3ff', rot: -0.1 },
  { x: 0.22, y: 0.26, color: '#ffc2cf', rot: 0.05 },
  { x: 0.68, y: -0.2, color: '#b8f2d4', rot: -0.07 },
]

/** Experience corkboard: pinned notes joined by red string. */
export function Corkboard() {
  const { w, h } = CORKBOARD
  return (
    <group position={[ROOM.minX + 0.04, CORKBOARD.y, CORKBOARD.z]} rotation={[0, Math.PI / 2, 0]}>
      <Interactive id="experience">
        <RBox size={[w + 0.14, h + 0.14, 0.06]} radius={0.03} color="#c98d66" />
        <RBox size={[w, h, 0.07]} radius={0.015} color="#e0b07a" outline={false} />
        {NOTES.map((n, i) => (
          <group key={i} position={[n.x, n.y, 0.04]} rotation={[0, 0, n.rot]}>
            <RBox size={[0.36, 0.34, 0.012]} radius={0.006} color={n.color} outline={0.008} />
            {[0.08, 0.01, -0.06].map((ly) => (
              <mesh key={ly} position={[0, ly, 0.008]}>
                <planeGeometry args={[0.24, 0.02]} />
                <meshBasicMaterial color="#8f88b5" transparent opacity={0.6} />
              </mesh>
            ))}
            <Ball
              r={0.028}
              color="#e2574c"
              outline={0.008}
              position={[0, 0.14, 0.02]}
              segments={10}
            />
          </group>
        ))}
        {NOTES.slice(0, -1).map((a, i) => {
          const b = NOTES[i + 1]
          const ax = a.x
          const ay = a.y + 0.14
          const bx = b.x
          const by = b.y + 0.14
          const len = Math.hypot(bx - ax, by - ay)
          return (
            <mesh
              key={i}
              position={[(ax + bx) / 2, (ay + by) / 2, 0.065]}
              rotation={[0, 0, Math.atan2(by - ay, bx - ax)]}
            >
              <boxGeometry args={[len, 0.012, 0.005]} />
              <meshBasicMaterial color="#d13c3c" />
            </mesh>
          )
        })}
        {/* A small framed certificate pinned in the corner */}
        <group position={[0.75, 0.42, 0.05]} rotation={[0, 0, -0.04]}>
          <RBox size={[0.36, 0.26, 0.02]} radius={0.01} color="#ffd166" outline={0.008} />
          <RBox size={[0.3, 0.2, 0.022]} radius={0.006} color="#fffaf0" outline={false} />
          <Ball
            r={0.035}
            color="#e2574c"
            outline={0.006}
            position={[0.09, -0.05, 0.02]}
            segments={10}
          />
        </group>
      </Interactive>
    </group>
  )
}
