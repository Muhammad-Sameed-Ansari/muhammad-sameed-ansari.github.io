import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, MeshBasicMaterial } from 'three'
import { PC_TOWER } from '../scene/layout'
import { RBox } from '../scene/primitives'

/** Gaming PC with an RGB fan behind the side window and blinking front LEDs. */
export function PCTower() {
  const fan = useRef<Group>(null)
  const ring = useRef<MeshBasicMaterial>(null)
  const power = useRef<MeshBasicMaterial>(null)
  const disk = useRef<MeshBasicMaterial>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (fan.current) fan.current.rotation.x += delta * 6
    ring.current?.color.setHSL((t * 0.08) % 1, 0.75, 0.68)
    power.current?.color.set(Math.sin(t * 2) > -0.6 ? '#7fffb0' : '#2f6b4a')
    disk.current?.color.set(Math.sin(t * 13) * Math.sin(t * 3.1) > 0.3 ? '#ffd166' : '#6b5a2a')
  })

  const { w, d, h } = PC_TOWER
  return (
    <group position={[PC_TOWER.x, 0, PC_TOWER.z]}>
      <RBox size={[w, h, d]} radius={0.05} color="#b3bde0" position={[0, h / 2, 0]} castShadow />
      {/* Side window facing the room */}
      <RBox
        size={[0.02, h - 0.2, d - 0.18]}
        radius={0.01}
        color="#3b3a55"
        outline={0.01}
        position={[w / 2 + 0.005, h / 2, 0]}
      />
      <group ref={fan} position={[w / 2 + 0.02, h / 2 + 0.12, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.15, 0.025, 8, 28]} />
          <meshBasicMaterial ref={ring} toneMapped={false} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[(i * Math.PI) / 2, 0, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[0.01, 0.22, 0.05]} />
            <meshBasicMaterial color="#8f88b5" />
          </mesh>
        ))}
      </group>
      {/* Front panel LEDs */}
      <mesh position={[0.08, h - 0.12, d / 2 + 0.003]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial ref={power} toneMapped={false} />
      </mesh>
      <mesh position={[-0.02, h - 0.12, d / 2 + 0.003]}>
        <circleGeometry args={[0.018, 16]} />
        <meshBasicMaterial ref={disk} toneMapped={false} />
      </mesh>
      {[0.3, 0.42, 0.54].map((y) => (
        <RBox
          key={y}
          size={[w - 0.16, 0.04, 0.01]}
          radius={0.004}
          color="#8f9bc4"
          outline={false}
          position={[0, y, d / 2 + 0.003]}
        />
      ))}
    </group>
  )
}
