import { Outlines } from '@react-three/drei'
import { MIRROR } from '../scene/layout'
import { RBox, Toon } from '../scene/primitives'
import { INK } from '../scene/toon'
import { Interactive } from './Interactive'

const FRAME = '#ffcf70'

/** Standing oval mirror for the About section, with fake cartoon shine. */
export function Mirror() {
  return (
    <group position={[MIRROR.x, 0, MIRROR.z]}>
      <Interactive id="about">
        {/* Legs */}
        {[-1, 1].map((side) => (
          <RBox
            key={side}
            size={[0.06, 1.25, 0.06]}
            radius={0.02}
            color={FRAME}
            position={[side * 0.32, 0.62, 0.05]}
            rotation={[0, 0, side * -0.06]}
          />
        ))}
        <RBox
          size={[0.8, 0.06, 0.32]}
          radius={0.025}
          color={FRAME}
          position={[0, 0.04, 0]}
          castShadow
        />
        <group position={[0, 1.15, 0.05]} rotation={[-0.06, 0, 0]} scale={[1, 1.45, 1]}>
          <mesh castShadow>
            <torusGeometry args={[0.34, 0.05, 12, 40]} />
            <Toon color={FRAME} />
            <Outlines thickness={0.018} color={INK} />
          </mesh>
          <mesh position={[0, 0, -0.005]}>
            <circleGeometry args={[0.34, 40]} />
            <meshBasicMaterial color="#cde9ff" />
          </mesh>
          {/* Shine streaks */}
          {[
            [-0.1, 0.08, 0.06],
            [0.02, 0.0, 0.03],
          ].map(([x, y, wdt], i) => (
            <mesh key={i} position={[x, y, 0.002]} rotation={[0, 0, -0.7]}>
              <planeGeometry args={[wdt, 0.42]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
            </mesh>
          ))}
        </group>
        {/* Sticky note */}
        <group position={[0.24, 1.55, 0.09]} rotation={[0, 0, 0.18]}>
          <RBox size={[0.16, 0.16, 0.01]} radius={0.004} color="#ffc2cf" outline={0.008} />
          <mesh position={[0, 0, 0.007]}>
            <planeGeometry args={[0.1, 0.018]} />
            <meshBasicMaterial color="#d13c3c" />
          </mesh>
        </group>
      </Interactive>
    </group>
  )
}
