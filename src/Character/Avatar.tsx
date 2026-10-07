import { Outlines } from '@react-three/drei'
import type { RefObject } from 'react'
import { DoubleSide } from 'three'
import type { AvatarConfig } from '../content/types'
import { Ball, Cap, Cyl, RBox, Toon } from '../scene/primitives'
import { INK, gradientMap } from '../scene/toon'
import type { AvatarRig } from './rig'

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 + amount))))
  const r = ch(n >> 16)
  const g = ch((n >> 8) & 255)
  const b = ch(n & 255)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const HEAD_Y = 0.3
const HEAD_R = 0.33

function HairCap({
  color,
  r = HEAD_R + 0.018,
  tilt = -0.38,
  length = 0.46,
}: {
  color: string
  r?: number
  tilt?: number
  length?: number
}) {
  return (
    <mesh position={[0, HEAD_Y + 0.01, -0.01]} rotation={[tilt, 0, 0]} castShadow>
      <sphereGeometry args={[r, 24, 14, 0, Math.PI * 2, 0, Math.PI * length]} />
      <meshToonMaterial color={color} gradientMap={gradientMap} side={DoubleSide} />
      <Outlines thickness={0.016} color={INK} />
    </mesh>
  )
}

function Hair({ style, color }: { style: AvatarConfig['hairStyle']; color: string }) {
  switch (style) {
    case 'buzz':
      return <HairCap color={color} r={HEAD_R + 0.008} length={0.42} />
    case 'short':
      return (
        <>
          <HairCap color={color} />
          {[-0.14, 0, 0.13].map((x, i) => (
            <Ball
              key={x}
              r={0.105 - i * 0.008}
              color={color}
              outline={0.014}
              position={[x, HEAD_Y + 0.22, 0.2]}
              scale={[1.2, 0.75, 0.9]}
            />
          ))}
        </>
      )
    case 'curly':
      return (
        <>
          <HairCap color={color} length={0.5} />
          {Array.from({ length: 13 }, (_, i) => {
            const a = (i / 13) * Math.PI * 2
            const ring = i % 2 ? 0.27 : 0.2
            return (
              <Ball
                key={i}
                r={0.1}
                color={color}
                outline={0.014}
                segments={12}
                position={[
                  Math.cos(a) * ring,
                  HEAD_Y + 0.24 + (i % 3) * 0.03,
                  Math.sin(a) * ring - 0.02,
                ]}
              />
            )
          })}
        </>
      )
    case 'long':
      return (
        <>
          <HairCap color={color} />
          <RBox
            size={[0.66, 0.6, 0.24]}
            radius={0.11}
            color={color}
            position={[0, HEAD_Y - 0.12, -0.17]}
          />
          <Cap r={0.07} length={0.3} color={color} position={[0.3, HEAD_Y - 0.1, 0.06]} />
          <Cap r={0.07} length={0.3} color={color} position={[-0.3, HEAD_Y - 0.1, 0.06]} />
        </>
      )
    case 'bun':
      return (
        <>
          <HairCap color={color} />
          <Ball r={0.14} color={color} position={[0, HEAD_Y + 0.36, -0.12]} />
        </>
      )
    case 'spiky':
      return (
        <>
          <HairCap color={color} />
          {Array.from({ length: 7 }, (_, i) => {
            const a = -0.9 + (i / 6) * 1.8
            return (
              <mesh
                key={i}
                position={[Math.sin(a) * 0.2, HEAD_Y + 0.3, Math.cos(a) * 0.05 - 0.02]}
                rotation={[-0.2, 0, -a * 0.6]}
              >
                <coneGeometry args={[0.08, 0.22, 8]} />
                <Toon color={color} />
                <Outlines thickness={0.014} color={INK} />
              </mesh>
            )
          })}
        </>
      )
  }
}

export function Avatar({ config, rig }: { config: AvatarConfig; rig: RefObject<AvatarRig> }) {
  const hood = shade(config.hoodie, -0.15)
  const bind =
    <K extends keyof AvatarRig>(key: K) =>
    (node: AvatarRig[K]) => {
      rig.current[key] = node
    }
  return (
    <group ref={bind('body')}>
      {/* Legs */}
      {[0.1, -0.1].map((x) => (
        <group key={x} ref={bind(x > 0 ? 'legL' : 'legR')} position={[x, 0.3, 0]}>
          <Cap r={0.075} length={0.12} color={config.pants} position={[0, -0.12, 0]} castShadow />
          <RBox
            size={[0.15, 0.09, 0.21]}
            radius={0.04}
            color={config.shoes}
            position={[0, -0.25, 0.035]}
            castShadow
          />
        </group>
      ))}

      <group ref={bind('torso')} position={[0, 0.3, 0]}>
        {/* Hoodie */}
        <RBox
          size={[0.46, 0.42, 0.33]}
          radius={0.13}
          color={config.hoodie}
          position={[0, 0.19, 0]}
          castShadow
        />
        <RBox
          size={[0.26, 0.09, 0.03]}
          radius={0.02}
          color={hood}
          position={[0, 0.1, 0.16]}
          outline={0.01}
        />
        <RBox size={[0.38, 0.13, 0.16]} radius={0.06} color={hood} position={[0, 0.38, -0.12]} />
        {[0.055, -0.055].map((x) => (
          <Cyl
            key={x}
            r={0.012}
            h={0.1}
            color="#fffaf0"
            outline={false}
            position={[x, 0.27, 0.17]}
          />
        ))}

        {/* Arms */}
        {[0.26, -0.26].map((x) => (
          <group key={x} ref={bind(x > 0 ? 'armL' : 'armR')} position={[x, 0.33, 0]}>
            <Cap
              r={0.068}
              length={0.13}
              color={config.hoodie}
              position={[0, -0.12, 0]}
              castShadow
            />
            <Ball r={0.072} color={config.skin} position={[0, -0.26, 0]} segments={14} />
            {x < 0 && (
              <>
                <RBox
                  ref={bind('phone')}
                  size={[0.07, 0.13, 0.018]}
                  radius={0.008}
                  color="#3b3a55"
                  outline={0.008}
                  position={[0.02, -0.3, 0.05]}
                  rotation={[0.3, 0, 0]}
                  visible={false}
                />
                <group ref={bind('mug')} position={[0.02, -0.3, 0.06]} visible={false}>
                  <Cyl r={0.06} h={0.11} color="#ff9f8a" outline={0.01} />
                  <Cyl r={0.05} h={0.01} color="#6b3f2a" outline={false} position={[0, 0.05, 0]} />
                </group>
              </>
            )}
          </group>
        ))}

        {/* Head */}
        <group ref={bind('head')} position={[0, 0.4, 0]}>
          <Ball
            r={HEAD_R}
            color={config.skin}
            position={[0, HEAD_Y, 0]}
            scale={[1.06, 0.96, 1]}
            segments={28}
            castShadow
          />
          {[0.335, -0.335].map((x) => (
            <Ball
              key={x}
              r={0.07}
              color={config.skin}
              position={[x, HEAD_Y - 0.02, 0]}
              segments={12}
            />
          ))}

          <group ref={bind('eyes')} position={[0, HEAD_Y - 0.01, 0]}>
            {[0.115, -0.115].map((x) => (
              <group key={x} position={[x, 0, 0.297]}>
                <Ball
                  r={0.052}
                  color={config.eyeColor}
                  outline={false}
                  scale={[0.85, 1.1, 0.6]}
                  segments={14}
                />
                <Ball
                  r={0.017}
                  color="#ffffff"
                  outline={false}
                  position={[0.017, 0.02, 0.03]}
                  segments={8}
                />
              </group>
            ))}
          </group>
          {[0.2, -0.2].map((x) => (
            <Ball
              key={x}
              r={0.05}
              color="#ff9fa8"
              outline={false}
              position={[x, HEAD_Y - 0.1, 0.262]}
              scale={[1.2, 0.7, 0.4]}
              segments={10}
            />
          ))}
          <mesh position={[0, HEAD_Y - 0.11, 0.312]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.042, 0.011, 6, 14, Math.PI]} />
            <meshBasicMaterial color={INK} />
          </mesh>
          {[0.115, -0.115].map((x) => (
            <Cap
              key={x}
              r={0.012}
              length={0.06}
              color={config.hairColor}
              outline={false}
              position={[x, HEAD_Y + 0.1, 0.3]}
              rotation={[0, 0, Math.PI / 2 + (x > 0 ? -0.15 : 0.15)]}
            />
          ))}

          {config.glasses && (
            <group position={[0, HEAD_Y - 0.01, 0.335]}>
              {[0.115, -0.115].map((x) => (
                <mesh key={x} position={[x, 0, 0]}>
                  <torusGeometry args={[0.082, 0.014, 8, 24]} />
                  <meshToonMaterial color={config.glassesColor} gradientMap={gradientMap} />
                </mesh>
              ))}
              <Cyl
                r={0.01}
                h={0.07}
                color={config.glassesColor}
                outline={false}
                rotation={[0, 0, Math.PI / 2]}
              />
            </group>
          )}

          <Hair style={config.hairStyle} color={config.hairColor} />

          {config.facialHair === 'beard' && (
            <Ball
              r={0.25}
              color={config.hairColor}
              position={[0, HEAD_Y - 0.17, 0.06]}
              scale={[1.15, 0.7, 0.85]}
            />
          )}
          {config.facialHair === 'mustache' && (
            <Cap
              r={0.022}
              length={0.08}
              color={config.hairColor}
              outline={0.008}
              position={[0, HEAD_Y - 0.075, 0.318]}
              rotation={[0, 0, Math.PI / 2]}
            />
          )}

          {config.headphones && (
            <group position={[0, HEAD_Y, 0]}>
              <mesh>
                <torusGeometry args={[0.37, 0.03, 8, 24, Math.PI]} />
                <Toon color="#3b3a55" />
                <Outlines thickness={0.012} color={INK} />
              </mesh>
              {[0.36, -0.36].map((x) => (
                <Cyl
                  key={x}
                  r={0.1}
                  h={0.08}
                  color="#ff8a80"
                  position={[x, 0, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                />
              ))}
            </group>
          )}
        </group>
      </group>
    </group>
  )
}
