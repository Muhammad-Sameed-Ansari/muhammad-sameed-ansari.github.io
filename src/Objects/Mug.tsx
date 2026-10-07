import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3, type Group } from 'three'
import { usePrefersReducedMotion } from '../lib/media'
import { Cyl, Toon } from '../scene/primitives'
import { spawnPuff } from '../scene/puffPool'
import { useStore } from '../store/useStore'

const world = new Vector3()

/** Coffee mug that steams gently, and puffs a big cloud when clicked. */
export function Mug(props: Omit<ThreeElements['group'], 'ref'>) {
  const group = useRef<Group>(null)
  const reducedMotion = usePrefersReducedMotion()
  const state = useRef({ next: 0, seenPokes: 0, hop: 0 })

  useFrame((frame, delta) => {
    const g = group.current
    if (!g) return
    const t = frame.clock.elapsedTime
    const s = state.current
    const pokes = useStore.getState().pokes.mug
    g.getWorldPosition(world)
    if (pokes !== s.seenPokes) {
      s.seenPokes = pokes
      s.hop = 1
      spawnPuff(world.x, world.y + 0.2, world.z, {
        count: 8,
        size: 0.05,
        spread: 0.15,
        rise: 0.6,
        life: 1.1,
      })
    }
    if (!reducedMotion && t > s.next) {
      s.next = t + 0.45 + Math.random() * 0.4
      spawnPuff(world.x, world.y + 0.18, world.z, {
        size: 0.035,
        spread: 0.05,
        rise: 0.3,
        life: 1.2,
      })
    }
    s.hop = Math.max(0, s.hop - delta * 2.5)
    g.position.y = Math.sin(s.hop * Math.PI) * 0.08
    g.rotation.z = Math.sin(s.hop * Math.PI * 3) * 0.15 * s.hop
  })

  return (
    <group {...props}>
      <group ref={group}>
        <Cyl r={0.075} h={0.15} color="#ff9f8a" position={[0, 0.075, 0]} castShadow />
        <Cyl r={0.062} h={0.01} color="#6b3f2a" outline={false} position={[0, 0.146, 0]} />
        <mesh position={[0.075, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.014, 8, 16, Math.PI]} />
          <Toon color="#ff9f8a" />
        </mesh>
        <Cyl r={0.076} h={0.03} color="#fff6ec" outline={false} position={[0, 0.06, 0]} />
      </group>
    </group>
  )
}
