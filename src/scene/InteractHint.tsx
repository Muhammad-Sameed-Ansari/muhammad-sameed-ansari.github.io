import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { useStore } from '../store/useStore'
import { OBJECTS } from './objects'

/** Glowing, pulsing ring on the floor where the character can use the nearby object. */
export function InteractHint() {
  const group = useRef<Group>(null)
  useFrame((state) => {
    const g = group.current
    if (!g) return
    const { nearId, panel } = useStore.getState()
    const spot = nearId && !panel ? OBJECTS[nearId].interact : undefined
    g.visible = !!spot
    if (!spot) return
    g.position.set(spot.x, 0.025, spot.z)
    g.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.08)
  })
  return (
    <group ref={group} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.44, 40]} />
        <meshBasicMaterial color="#ffd166" transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  )
}
