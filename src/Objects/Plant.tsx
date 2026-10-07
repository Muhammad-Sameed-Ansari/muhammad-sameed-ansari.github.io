import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PLANT } from '../scene/layout'
import { Ball, Cyl } from '../scene/primitives'
import { spawnPuff } from '../scene/puffPool'
import { useStore } from '../store/useStore'
import { Interactive } from './Interactive'

const LEAVES = [
  { a: 0, tilt: 0.35, h: 0.75, c: '#7cc47f' },
  { a: 1.2, tilt: 0.55, h: 0.6, c: '#5fae6e' },
  { a: 2.4, tilt: 0.45, h: 0.7, c: '#7cc47f' },
  { a: 3.5, tilt: 0.6, h: 0.55, c: '#5fae6e' },
  { a: 4.6, tilt: 0.4, h: 0.68, c: '#86d08a' },
  { a: 5.6, tilt: 0.25, h: 0.82, c: '#5fae6e' },
]

/** Potted plant that sways a little and wiggles like jelly when poked. */
export function Plant() {
  const leaves = useRef<Group>(null)
  const wiggle = useRef({ seen: 0, start: -10 })

  useFrame((state) => {
    const g = leaves.current
    if (!g) return
    const t = state.clock.elapsedTime
    const w = wiggle.current
    const pokes = useStore.getState().pokes.plant
    if (pokes !== w.seen) {
      w.seen = pokes
      w.start = t
      spawnPuff(PLANT.x, 1.0, PLANT.z, {
        count: 7,
        color: '#7cc47f',
        size: 0.05,
        spread: 0.7,
        rise: 0.5,
        life: 0.9,
      })
    }
    const since = t - w.start
    const spring = since < 3 ? Math.exp(-since * 2.5) * Math.sin(since * 16) * 0.3 : 0
    g.rotation.z = Math.sin(t * 0.8) * 0.025 + spring
    g.rotation.x = Math.sin(t * 0.6) * 0.02 + spring * 0.5
    g.scale.y = 1 + spring * 0.4
  })

  return (
    <group position={[PLANT.x, 0, PLANT.z]}>
      <Interactive id="plant">
        <Cyl r={0.27} rBottom={0.2} h={0.42} color="#e07a5f" position={[0, 0.21, 0]} castShadow />
        <Cyl r={0.3} h={0.07} color="#ef8f73" position={[0, 0.42, 0]} />
        <Cyl r={0.25} h={0.02} color="#6b4a35" outline={false} position={[0, 0.455, 0]} />
        <group ref={leaves} position={[0, 0.45, 0]}>
          {LEAVES.map((l, i) => (
            <group key={i} rotation={[0, l.a, 0]}>
              <group rotation={[l.tilt, 0, 0]}>
                <Cyl r={0.012} h={l.h} color="#4f9a5d" outline={false} position={[0, l.h / 2, 0]} />
                <Ball
                  r={0.22}
                  color={l.c}
                  outline={0.014}
                  segments={14}
                  position={[0, l.h, 0.05]}
                  rotation={[0.9, 0, 0]}
                  scale={[0.75, 1, 0.12]}
                  castShadow
                />
              </group>
            </group>
          ))}
        </group>
      </Interactive>
    </group>
  )
}
