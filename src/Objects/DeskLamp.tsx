import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useRef } from 'react'
import { AdditiveBlending, Color, type MeshBasicMaterial, type PointLight } from 'three'
import { Ball, Cyl, RBox, Toon } from '../scene/primitives'
import { env } from '../scene/runtime'
import { INK } from '../scene/toon'
import { Outlines } from '@react-three/drei'

const BULB_OFF = new Color('#f3ead6')
const BULB_ON = new Color('#fff3b0')
const SHADE = '#7fd6b4'

/** Bendy desk lamp. Turns on automatically at night, or when clicked. */
export function DeskLamp(props: Omit<ThreeElements['group'], 'ref'>) {
  const light = useRef<PointLight>(null)
  const bulb = useRef<MeshBasicMaterial>(null)
  const cone = useRef<MeshBasicMaterial>(null)

  useFrame(() => {
    const on = env.lamp
    if (light.current) light.current.intensity = on * 3.2
    bulb.current?.color.lerpColors(BULB_OFF, BULB_ON, on)
    if (cone.current) cone.current.opacity = on * 0.12
  })

  return (
    <group {...props}>
      <Cyl r={0.12} rBottom={0.14} h={0.05} color={SHADE} position={[0, 0.025, 0]} castShadow />
      <Cyl r={0.022} h={0.42} color="#fff6ec" position={[0, 0.24, 0]} rotation={[0, 0, -0.25]} />
      <Ball r={0.035} color={SHADE} position={[0.05, 0.45, 0]} segments={10} />
      <Cyl r={0.02} h={0.32} color="#fff6ec" position={[0.16, 0.52, 0]} rotation={[0, 0, -1.15]} />
      <group position={[0.3, 0.55, 0.02]} rotation={[0.2, 0, 0.55]}>
        <mesh castShadow>
          <coneGeometry args={[0.13, 0.18, 20, 1, true]} />
          <Toon color={SHADE} />
          <Outlines thickness={0.014} color={INK} />
        </mesh>
        <RBox size={[0.07, 0.06, 0.07]} radius={0.02} color={SHADE} position={[0, 0.1, 0]} />
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.055, 14, 10]} />
          <meshBasicMaterial ref={bulb} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <coneGeometry args={[0.45, 0.7, 24, 1, true]} />
          <meshBasicMaterial
            ref={cone}
            color="#fff1b8"
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight
          ref={light}
          position={[0, -0.12, 0]}
          color="#ffd89a"
          distance={5}
          decay={1.6}
          intensity={0}
        />
      </group>
    </group>
  )
}
