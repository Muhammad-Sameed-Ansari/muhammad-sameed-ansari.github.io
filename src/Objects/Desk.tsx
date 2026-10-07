import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { MeshBasicMaterial } from 'three'
import { DESK, LAPTOP } from '../scene/layout'
import { RBox, Ball, Cyl } from '../scene/primitives'
import { codeTexture, laptopTexture } from '../scene/textures'
import { DeskFan } from './DeskFan'
import { DeskLamp } from './DeskLamp'
import { Interactive } from './Interactive'
import { Mug } from './Mug'

const WOOD = '#e3a77c'
const WOOD_DARK = '#c98d66'
const TOP_Y = DESK.h

function Laptop() {
  const glow = useRef<MeshBasicMaterial>(null)
  useFrame((state) => {
    // Gentle screen "breathing" so the laptop feels alive.
    if (glow.current) glow.current.opacity = 0.85 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08
  })
  return (
    <group position={[LAPTOP.x - DESK.x, TOP_Y, LAPTOP.z - DESK.z]}>
      <RBox size={[0.74, 0.04, 0.5]} radius={0.015} color="#d9dcf7" position={[0, 0.02, 0]} />
      <RBox
        size={[0.62, 0.01, 0.22]}
        radius={0.004}
        color="#5b587a"
        outline={false}
        position={[0, 0.042, -0.05]}
      />
      <RBox
        size={[0.2, 0.01, 0.1]}
        radius={0.004}
        color="#c4c7ea"
        outline={false}
        position={[0, 0.042, 0.15]}
      />
      <group position={[0, 0.04, -0.24]} rotation={[-0.22, 0, 0]}>
        <RBox size={[0.74, 0.48, 0.035]} radius={0.015} color="#d9dcf7" position={[0, 0.24, 0]} />
        <mesh position={[0, 0.25, 0.019]}>
          <planeGeometry args={[0.64, 0.4]} />
          <meshBasicMaterial ref={glow} map={laptopTexture()} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function CodeMonitor() {
  useFrame((_, delta) => {
    const tex = codeTexture()
    tex.offset.y = (tex.offset.y + delta * 0.04) % 1
  })
  return (
    <group position={[0.58, TOP_Y, -0.28]} rotation={[0, -0.22, 0]}>
      <RBox size={[0.32, 0.03, 0.22]} radius={0.012} color="#4b4868" position={[0, 0.015, 0]} />
      <RBox size={[0.07, 0.3, 0.05]} radius={0.02} color="#4b4868" position={[0, 0.17, -0.03]} />
      <RBox size={[0.86, 0.54, 0.05]} radius={0.03} color="#4b4868" position={[0, 0.5, 0]} />
      <mesh position={[0, 0.5, 0.027]}>
        <planeGeometry args={[0.78, 0.46]} />
        <meshBasicMaterial map={codeTexture()} toneMapped={false} />
      </mesh>
      {/* Sticky note on the bezel */}
      <RBox
        size={[0.11, 0.11, 0.01]}
        radius={0.004}
        color="#ffd166"
        outline={0.008}
        position={[0.36, 0.72, 0.03]}
        rotation={[0, 0, 0.15]}
      />
    </group>
  )
}

export function Desk() {
  const halfW = DESK.w / 2
  const halfD = DESK.d / 2
  return (
    <group position={[DESK.x, 0, DESK.z]}>
      <Interactive id="projects">
        {/* Top */}
        <RBox
          size={[DESK.w, 0.08, DESK.d]}
          radius={0.03}
          color={WOOD}
          position={[0, TOP_Y - 0.04, 0]}
          castShadow
          receiveShadow
        />
        {/* Drawer cabinet on the left */}
        <RBox
          size={[0.62, TOP_Y - 0.08, DESK.d - 0.1]}
          radius={0.03}
          color={WOOD_DARK}
          position={[-halfW + 0.38, (TOP_Y - 0.08) / 2, 0]}
          castShadow
        />
        {[0.38, 0.16].map((y) => (
          <group key={y} position={[-halfW + 0.38, y, halfD - 0.04]}>
            <RBox size={[0.52, 0.18, 0.03]} radius={0.02} color={WOOD} outline={0.012} />
            <Ball r={0.025} color="#fff6ec" outline={0.008} position={[0, 0, 0.03]} segments={10} />
          </group>
        ))}
        {/* Legs on the right */}
        {[-1, 1].map((side) => (
          <RBox
            key={side}
            size={[0.09, TOP_Y - 0.08, 0.09]}
            radius={0.03}
            color={WOOD_DARK}
            position={[halfW - 0.12, (TOP_Y - 0.08) / 2, side * (halfD - 0.12)]}
            castShadow
          />
        ))}
        <Laptop />
        <CodeMonitor />
        {/* A small stack of books */}
        <group position={[-0.95, TOP_Y, -0.32]}>
          <RBox
            size={[0.34, 0.06, 0.24]}
            radius={0.01}
            color="#7ec4f5"
            outline={0.01}
            position={[0, 0.03, 0]}
          />
          <RBox
            size={[0.3, 0.05, 0.22]}
            radius={0.01}
            color="#ff8a80"
            outline={0.01}
            position={[0.01, 0.085, 0]}
            rotation={[0, 0.12, 0]}
          />
          <Cyl r={0.05} h={0.08} color="#7fd6b4" outline={0.01} position={[0, 0.15, 0]} />
        </group>
      </Interactive>

      <Interactive id="mug">
        <Mug position={[0.5, TOP_Y, 0.33]} />
      </Interactive>
      <Interactive id="lamp">
        <DeskLamp position={[-1.05, TOP_Y, -0.18]} />
      </Interactive>
      <DeskFan position={[1.12, TOP_Y, -0.28]} />
    </group>
  )
}
