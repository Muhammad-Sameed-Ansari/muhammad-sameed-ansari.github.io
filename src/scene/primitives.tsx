import { Outlines, RoundedBox } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import type { ReactNode, Ref } from 'react'
import type { Mesh, Texture } from 'three'
import { INK, gradientMap } from './toon'

/** Default outline thickness in world units. */
export const OUTLINE = 0.022

type MeshProps = Omit<ThreeElements['mesh'], 'args' | 'ref'>

interface ToonMeshProps extends MeshProps {
  color: string
  /** Outline thickness, or false for none. */
  outline?: number | false
  map?: Texture
  ref?: Ref<Mesh>
  children?: ReactNode
}

export function Toon({ color, map }: { color: string; map?: Texture }) {
  return <meshToonMaterial color={color} gradientMap={gradientMap} map={map ?? null} />
}

function Skin({ color, map, outline }: Pick<ToonMeshProps, 'color' | 'map' | 'outline'>) {
  return (
    <>
      <Toon color={color} map={map} />
      {outline !== false && <Outlines thickness={outline ?? OUTLINE} color={INK} />}
    </>
  )
}

/** Chunky rounded box, the workhorse of the room. */
export function RBox({
  size = [1, 1, 1],
  radius = 0.05,
  color,
  map,
  outline,
  children,
  ...props
}: ToonMeshProps & { size?: [number, number, number]; radius?: number }) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={3} {...props}>
      <Skin color={color} map={map} outline={outline} />
      {children}
    </RoundedBox>
  )
}

export function Ball({
  r = 0.5,
  color,
  map,
  outline,
  segments = 20,
  children,
  ...props
}: ToonMeshProps & { r?: number; segments?: number }) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[r, segments, Math.round(segments * 0.75)]} />
      <Skin color={color} map={map} outline={outline} />
      {children}
    </mesh>
  )
}

export function Cyl({
  r = 0.5,
  rBottom,
  h = 1,
  color,
  map,
  outline,
  segments = 20,
  children,
  ...props
}: ToonMeshProps & { r?: number; rBottom?: number; h?: number; segments?: number }) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={[r, rBottom ?? r, h, segments]} />
      <Skin color={color} map={map} outline={outline} />
      {children}
    </mesh>
  )
}

export function Cap({
  r = 0.1,
  length = 0.3,
  color,
  outline,
  children,
  ...props
}: ToonMeshProps & { r?: number; length?: number }) {
  return (
    <mesh {...props}>
      <capsuleGeometry args={[r, length, 6, 14]} />
      <Skin color={color} outline={outline} />
      {children}
    </mesh>
  )
}
