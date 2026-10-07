import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { DOOR, ROOM, SIDE_TABLE } from '../scene/layout'
import { Ball, Cap, Cyl, RBox } from '../scene/primitives'
import { useStore } from '../store/useStore'
import { Interactive } from './Interactive'

const DOOR_COLOR = '#c98f6b'
const PHONE = '#ff8a80'

/** Retro phone that rings (shakes) while the character stands next to it. */
function Phone() {
  const handset = useRef<Group>(null)
  useFrame((state) => {
    const g = handset.current
    if (!g) return
    const ringing = useStore.getState().nearId === 'contact'
    const t = state.clock.elapsedTime
    const burst = ringing && Math.sin(t * 3) > 0 ? 1 : 0
    g.position.y = 0.17 + burst * Math.abs(Math.sin(t * 40)) * 0.03
    g.rotation.z = burst * Math.sin(t * 40) * 0.08
  })
  return (
    <group position={[0, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
      <RBox
        size={[0.34, 0.14, 0.26]}
        radius={0.05}
        color={PHONE}
        position={[0, 0.07, 0]}
        castShadow
      />
      <Cyl
        r={0.08}
        h={0.02}
        color="#fffaf0"
        outline={0.008}
        position={[0, 0.145, 0.06]}
        rotation={[0.35, 0, 0]}
      />
      <Ball r={0.02} color="#2d2541" outline={false} position={[0, 0.16, 0.065]} segments={8} />
      <group ref={handset} position={[0, 0.17, -0.04]}>
        <Cap r={0.04} length={0.24} color={PHONE} rotation={[0, 0, Math.PI / 2]} />
        {[-1, 1].map((s) => (
          <RBox
            key={s}
            size={[0.09, 0.07, 0.11]}
            radius={0.03}
            color={PHONE}
            position={[s * 0.16, -0.02, 0]}
          />
        ))}
      </group>
    </group>
  )
}

/** Front door with a mail slot, a doormat, and the side table with the phone. */
export function ContactCorner() {
  const wallX = ROOM.minX
  return (
    <group>
      <Interactive id="contact">
        <group position={[SIDE_TABLE.x, 0, SIDE_TABLE.z]}>
          <Cyl r={0.3} h={0.06} color="#fff6ec" position={[0, 0.62, 0]} castShadow />
          <Cyl r={0.04} h={0.58} color="#d7a27a" position={[0, 0.3, 0]} />
          <Cyl r={0.18} rBottom={0.2} h={0.04} color="#d7a27a" position={[0, 0.02, 0]} />
          <Phone />
        </group>
        <group position={[wallX + 0.04, 0, DOOR.z]} rotation={[0, Math.PI / 2, 0]}>
          <RBox
            size={[DOOR.w + 0.16, DOOR.h + 0.08, 0.06]}
            radius={0.02}
            color="#fff6ec"
            position={[0, (DOOR.h + 0.08) / 2, 0]}
          />
          <RBox
            size={[DOOR.w, DOOR.h, 0.08]}
            radius={0.03}
            color={DOOR_COLOR}
            position={[0, DOOR.h / 2, 0.02]}
            castShadow
          />
          {[0.6, 1.5].map((y) => (
            <RBox
              key={y}
              size={[DOOR.w - 0.3, 0.6, 0.02]}
              radius={0.02}
              color="#b97f5d"
              outline={0.01}
              position={[0, y, 0.065]}
            />
          ))}
          <RBox
            size={[0.3, 0.05, 0.02]}
            radius={0.01}
            color="#4b4868"
            outline={0.008}
            position={[0, 1.08, 0.07]}
          />
          <Ball
            r={0.045}
            color="#ffd166"
            position={[DOOR.w / 2 - 0.14, 1.05, 0.09]}
            segments={12}
          />
        </group>
        <RBox
          size={[0.6, 0.025, 0.95]}
          radius={0.01}
          color="#ff9f8a"
          outline={0.01}
          position={[wallX + 0.45, 0.012, DOOR.z]}
        />
      </Interactive>
    </group>
  )
}
