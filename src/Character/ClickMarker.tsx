import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { marker, now } from '../scene/runtime'

/** Bouncy ring that marks where the character is walking to. */
export function ClickMarker() {
  const group = useRef<Group>(null)

  useFrame(() => {
    const g = group.current
    if (!g) return
    g.visible = marker.active
    if (!marker.active) return
    const age = now() - marker.born
    const pop = Math.min(age / 0.25, 1)
    const overshoot = 1 + Math.sin(pop * Math.PI) * 0.35
    const pulse = 1 + Math.sin(age * 6) * 0.08
    g.position.set(marker.x, 0.02, marker.z)
    g.scale.setScalar(pop * overshoot * pulse)
  })

  return (
    <group ref={group} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.28, 32]} />
        <meshBasicMaterial color="#ff7a6b" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 20]} />
        <meshBasicMaterial color="#ffd166" transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  )
}
