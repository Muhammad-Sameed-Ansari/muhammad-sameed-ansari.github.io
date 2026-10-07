import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { CAT_BED } from '../scene/layout'
import { Ball, Cyl, Toon } from '../scene/primitives'
import { spawnPuff } from '../scene/puffPool'
import { INK } from '../scene/toon'
import { useStore } from '../store/useStore'
import { Interactive } from './Interactive'

const FUR = '#f6a85b'
const BELLY = '#fff3e3'
const AWAKE_FOR = 3.2

/** Sleepy cat in a cushion bed. Poke it and it hops up, meows and sends hearts. */
export function Cat() {
  const body = useRef<Group>(null)
  const head = useRef<Group>(null)
  const tail = useRef<Group>(null)
  const eyesOpen = useRef<Group>(null)
  const eyesClosed = useRef<Group>(null)
  const mood = useRef({ seen: 0, wokeAt: -10, nextHeart: 0 })

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const m = mood.current
    const pokes = useStore.getState().pokes.cat
    if (pokes !== m.seen) {
      m.seen = pokes
      m.wokeAt = t
    }
    const since = t - m.wokeAt
    const awake = since < AWAKE_FOR
    if (awake && t > m.nextHeart && since < 1.6) {
      m.nextHeart = t + 0.25
      spawnPuff(CAT_BED.x, 0.75, CAT_BED.z, {
        color: '#ff8fa5',
        size: 0.05,
        spread: 0.3,
        rise: 0.7,
        life: 1,
      })
    }
    const hop = awake && since < 0.5 ? Math.sin((since / 0.5) * Math.PI) * 0.18 : 0
    const breathe = Math.sin(t * (awake ? 3 : 1.4)) * 0.025
    if (body.current) {
      body.current.position.y = hop
      body.current.scale.set(1 + breathe * 0.5, 1 + breathe, 1)
    }
    if (head.current) {
      head.current.position.y = awake ? 0.29 : 0.21
      head.current.rotation.x = awake ? -0.25 : 0.25
      head.current.rotation.z = awake ? Math.sin(t * 4) * 0.12 : 0
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * (awake ? 8 : 1)) * (awake ? 0.5 : 0.12)
    if (eyesOpen.current) eyesOpen.current.visible = awake
    if (eyesClosed.current) eyesClosed.current.visible = !awake
  })

  return (
    <group position={[CAT_BED.x, 0, CAT_BED.z]} rotation={[0, 0.5, 0]}>
      <Interactive id="cat">
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.36, 0.13, 12, 28]} />
          <Toon color="#c3a6f0" />
        </mesh>
        <Cyl r={0.36} h={0.08} color="#dccbfa" position={[0, 0.06, 0]} />
        <group ref={body} position={[0, 0, 0]}>
          <Ball r={0.3} color={FUR} position={[0, 0.2, -0.02]} scale={[0.85, 0.6, 1]} castShadow />
          <group ref={tail} position={[0, 0.14, -0.26]}>
            <mesh rotation={[Math.PI / 2, 0, 0.4]}>
              <torusGeometry args={[0.2, 0.05, 8, 16, Math.PI * 0.9]} />
              <Toon color={FUR} />
            </mesh>
          </group>
          <group ref={head} position={[0, 0.21, 0.22]}>
            <Ball r={0.17} color={FUR} scale={[1.1, 0.95, 1]} />
            <Ball
              r={0.07}
              color={BELLY}
              outline={false}
              position={[0, -0.05, 0.13]}
              scale={[1.3, 0.8, 0.7]}
              segments={12}
            />
            <Ball
              r={0.018}
              color="#ff8fa5"
              outline={false}
              position={[0, -0.02, 0.17]}
              segments={8}
            />
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.1, 0.15, 0]} rotation={[0, 0, -s * 0.35]}>
                <coneGeometry args={[0.06, 0.12, 4]} />
                <Toon color={FUR} />
              </mesh>
            ))}
            <group ref={eyesClosed}>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.065, 0.02, 0.155]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.025, 0.007, 4, 10, Math.PI]} />
                  <meshBasicMaterial color={INK} />
                </mesh>
              ))}
            </group>
            <group ref={eyesOpen} visible={false}>
              {[-1, 1].map((s) => (
                <Ball
                  key={s}
                  r={0.03}
                  color={INK}
                  outline={false}
                  position={[s * 0.065, 0.02, 0.15]}
                  segments={10}
                />
              ))}
            </group>
          </group>
        </group>
      </Interactive>
    </group>
  )
}
