import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { usePrefersReducedMotion } from '../lib/media'
import { Ball, Cyl, Toon } from '../scene/primitives'
import { INK } from '../scene/toon'
import { Outlines } from '@react-three/drei'

const BODY = '#ffb8c6'

/** Little oscillating desk fan with spinning blades. */
export function DeskFan(props: Omit<ThreeElements['group'], 'ref'>) {
  const head = useRef<Group>(null)
  const blades = useRef<Group>(null)
  const reducedMotion = usePrefersReducedMotion()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (head.current) head.current.rotation.y = 0.6 + Math.sin(t * 0.5) * (reducedMotion ? 0 : 0.5)
    if (blades.current) blades.current.rotation.z -= delta * (reducedMotion ? 2 : 14)
  })

  return (
    <group {...props}>
      <Cyl r={0.1} rBottom={0.12} h={0.04} color={BODY} position={[0, 0.02, 0]} />
      <Cyl r={0.02} h={0.22} color="#fff6ec" position={[0, 0.14, 0]} />
      <group ref={head} position={[0, 0.27, 0]}>
        <mesh>
          <torusGeometry args={[0.13, 0.012, 6, 24]} />
          <Toon color="#fff6ec" />
          <Outlines thickness={0.008} color={INK} />
        </mesh>
        <group ref={blades}>
          {[0, 1, 2].map((i) => (
            <Ball
              key={i}
              r={0.06}
              color="#7ec4f5"
              outline={0.006}
              segments={10}
              scale={[0.7, 1, 0.15]}
              position={[
                Math.sin((i * Math.PI * 2) / 3) * 0.06,
                Math.cos((i * Math.PI * 2) / 3) * 0.06,
                0,
              ]}
              rotation={[0, 0, -(i * Math.PI * 2) / 3]}
            />
          ))}
        </group>
        <Ball r={0.03} color={BODY} outline={0.008} position={[0, 0, 0.01]} segments={10} />
        <Cyl
          r={0.04}
          h={0.06}
          color={BODY}
          position={[0, 0, -0.04]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  )
}
