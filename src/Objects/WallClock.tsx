import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { CLOCK, ROOM } from '../scene/layout'
import { Ball, Cyl, RBox } from '../scene/primitives'
import { INK } from '../scene/toon'

const TAU = Math.PI * 2

/** Wall clock showing the visitor's real local time, with a springy second hand. */
export function WallClock() {
  const hour = useRef<Group>(null)
  const minute = useRef<Group>(null)
  const second = useRef<Group>(null)

  useFrame(() => {
    const d = new Date()
    const ms = d.getMilliseconds() / 1000
    // The second hand snaps forward with a small overshoot, like a real quartz tick.
    const snap = Math.min(ms * 6, 1)
    const tick = d.getSeconds() - 1 + snap + Math.sin(snap * Math.PI) * 0.12
    const m = d.getMinutes() + d.getSeconds() / 60
    const h = (d.getHours() % 12) + m / 60
    if (second.current) second.current.rotation.z = -(tick / 60) * TAU
    if (minute.current) minute.current.rotation.z = -(m / 60) * TAU
    if (hour.current) hour.current.rotation.z = -(h / 12) * TAU
  })

  return (
    <group position={[CLOCK.x, CLOCK.y, ROOM.minZ + 0.05]}>
      <Cyl r={0.4} h={0.07} color="#ff8a80" rotation={[Math.PI / 2, 0, 0]} />
      <Cyl r={0.34} h={0.08} color="#fffaf0" outline={false} rotation={[Math.PI / 2, 0, 0]} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * TAU
        const long = i % 3 === 0
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.27, Math.cos(a) * 0.27, 0.045]}
            rotation={[0, 0, -a]}
          >
            <boxGeometry args={[long ? 0.03 : 0.018, long ? 0.07 : 0.04, 0.01]} />
            <meshBasicMaterial color={INK} />
          </mesh>
        )
      })}
      <group ref={hour} position={[0, 0, 0.055]}>
        <RBox
          size={[0.04, 0.17, 0.015]}
          radius={0.007}
          color={INK}
          outline={false}
          position={[0, 0.07, 0]}
        />
      </group>
      <group ref={minute} position={[0, 0, 0.065]}>
        <RBox
          size={[0.03, 0.25, 0.015]}
          radius={0.007}
          color={INK}
          outline={false}
          position={[0, 0.11, 0]}
        />
      </group>
      <group ref={second} position={[0, 0, 0.075]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.012, 0.28, 0.01]} />
          <meshBasicMaterial color="#e2574c" />
        </mesh>
      </group>
      <Ball r={0.025} color="#e2574c" outline={false} position={[0, 0, 0.08]} segments={10} />
    </group>
  )
}
