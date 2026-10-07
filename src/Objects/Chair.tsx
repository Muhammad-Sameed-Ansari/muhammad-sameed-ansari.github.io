import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { char } from '../Character/runtime'
import { CHAIR_PARKED, SIT_SPOT } from '../scene/layout'
import { Ball, Cyl, RBox } from '../scene/primitives'

const SEAT = '#b9a2e8'
const FRAME = '#5b587a'
const AT_DESK = Math.PI

/** Rolling desk chair. It glides under the character when they sit down. */
export function Chair() {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const k = 1 - Math.exp(-7 * Math.min(delta, 0.05))
    const target = char.sitting ? SIT_SPOT : CHAIR_PARKED
    const rot = char.sitting ? AT_DESK : AT_DESK + CHAIR_PARKED.rot
    g.position.x += (target.x - g.position.x) * k
    g.position.z += (target.z - g.position.z) * k
    g.rotation.y += (rot - g.rotation.y) * k
  })

  return (
    <group
      ref={group}
      position={[CHAIR_PARKED.x, 0, CHAIR_PARKED.z]}
      rotation={[0, AT_DESK + CHAIR_PARKED.rot, 0]}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation={[0, a, 0]}>
            <RBox
              size={[0.05, 0.04, 0.26]}
              radius={0.015}
              color={FRAME}
              outline={0.01}
              position={[0, 0.06, 0.13]}
            />
            <Ball
              r={0.035}
              color={FRAME}
              outline={0.008}
              position={[0, 0.035, 0.25]}
              segments={10}
            />
          </group>
        )
      })}
      <Cyl r={0.035} h={0.2} color={FRAME} position={[0, 0.17, 0]} />
      <RBox size={[0.52, 0.09, 0.5]} radius={0.04} color={SEAT} position={[0, 0.3, 0]} castShadow />
      <RBox size={[0.06, 0.32, 0.05]} radius={0.02} color={FRAME} position={[0, 0.45, -0.24]} />
      <RBox
        size={[0.5, 0.42, 0.09]}
        radius={0.06}
        color={SEAT}
        position={[0, 0.72, -0.27]}
        rotation={[-0.08, 0, 0]}
        castShadow
      />
    </group>
  )
}
