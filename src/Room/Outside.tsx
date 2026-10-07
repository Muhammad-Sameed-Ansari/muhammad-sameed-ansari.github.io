import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  type Group,
  type MeshBasicMaterial,
  type Points,
  type PointsMaterial,
} from 'three'
import { usePrefersReducedMotion } from '../lib/media'
import { ROOM, WINDOW } from '../scene/layout'
import { env } from '../scene/runtime'

const SKY_DAY = new Color('#9ad7ff')
const SKY_NIGHT = new Color('#211d52')
const HILL_DAY = new Color('#8fd19e')
const HILL_NIGHT = new Color('#2c3a63')
const BEAM_DAY = new Color('#fff1c9')
const BEAM_NIGHT = new Color('#8fa8ff')
/** Direction sunlight travels through the window (down, into the room). */
const LIGHT_DIR = { x: -0.35, z: 0.95 }

const winL = WINDOW.x - WINDOW.w / 2
const winR = WINDOW.x + WINDOW.w / 2
const winB = WINDOW.y - WINDOW.h / 2
const winT = WINDOW.y + WINDOW.h / 2
const wallZ = ROOM.minZ
const skyZ = ROOM.minZ - ROOM.wallThickness - 0.12

const project = (x: number, y: number): [number, number, number] => [
  x + LIGHT_DIR.x * y,
  0.012,
  wallZ + LIGHT_DIR.z * y,
]

function beamGeometry() {
  const top = [
    [winL, winB, wallZ],
    [winR, winB, wallZ],
    [winR, winT, wallZ],
    [winL, winT, wallZ],
  ]
  const floor = top.map(([x, y]) => project(x, y))
  const quads = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]
  const pos: number[] = []
  const col: number[] = []
  for (const [a, b] of quads) {
    // Two triangles per side, bright at the window and fading towards the floor.
    const verts = [top[a], top[b], floor[b], top[a], floor[b], floor[a]]
    const fade = [1, 1, 0.15, 1, 0.15, 0.15]
    verts.forEach((v, i) => {
      pos.push(...v)
      col.push(fade[i], fade[i], fade[i])
    })
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
  g.setAttribute('color', new BufferAttribute(new Float32Array(col), 3))
  return g
}

function floorPatchGeometry() {
  const pts = [project(winL, winB), project(winR, winB), project(winR, winT), project(winL, winT)]
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(pts.flat()), 3))
  g.setIndex([0, 2, 1, 0, 3, 2])
  return g
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 32, 32)
  return new CanvasTexture(c)
}

const MOTES = 36

/** Built once per page load; random star and dust positions don't need to be stable. */
function createAssets() {
  const starPos = new Float32Array(
    Array.from({ length: 28 }, () => [
      winL + Math.random() * WINDOW.w,
      winB + 0.35 + Math.random() * (WINDOW.h - 0.35),
      skyZ + 0.02,
    ]).flat(),
  )
  const seeds = Array.from({ length: MOTES }, () => ({
    x: winL + Math.random() * WINDOW.w,
    y: winB + Math.random() * WINDOW.h,
    s: 0.15 + Math.random() * 0.75,
    phase: Math.random() * Math.PI * 2,
  }))
  return {
    beam: beamGeometry(),
    patch: floorPatchGeometry(),
    starPos,
    seeds,
    motePos: new Float32Array(MOTES * 3),
    dot: dotTexture(),
  }
}

let assetCache: ReturnType<typeof createAssets> | undefined

/** Sky, sun/moon, clouds and stars behind the window, plus the sunbeam and dust motes. */
export function Outside() {
  const reducedMotion = usePrefersReducedMotion()
  const sky = useRef<MeshBasicMaterial>(null)
  const hills = useRef<MeshBasicMaterial>(null)
  const sun = useRef<Group>(null)
  const moon = useRef<Group>(null)
  const clouds = useRef<Group>(null)
  const stars = useRef<PointsMaterial>(null)
  const beam = useRef<MeshBasicMaterial>(null)
  const patch = useRef<MeshBasicMaterial>(null)
  const motes = useRef<Points>(null)
  const moteMat = useRef<PointsMaterial>(null)
  const [assets] = useState(() => (assetCache ??= createAssets()))

  useFrame((state) => {
    const n = env.night
    const t = state.clock.elapsedTime
    sky.current?.color.lerpColors(SKY_DAY, SKY_NIGHT, n)
    hills.current?.color.lerpColors(HILL_DAY, HILL_NIGHT, n)
    if (sun.current) sun.current.position.y = winT - 0.35 - n * 1.2
    if (moon.current) moon.current.position.y = winT - 0.35 - (1 - n) * 1.2
    if (stars.current) stars.current.opacity = n
    if (clouds.current) {
      clouds.current.children.forEach((c, i) => {
        const span = WINDOW.w + 1.4
        c.position.x = winL - 0.7 + ((t * (0.05 + i * 0.03) + i * 0.9) % span)
      })
      clouds.current.visible = n < 0.95
    }
    if (beam.current) {
      beam.current.color.lerpColors(BEAM_DAY, BEAM_NIGHT, n)
      beam.current.opacity = 0.16 - n * 0.09
    }
    if (patch.current) {
      patch.current.color.lerpColors(BEAM_DAY, BEAM_NIGHT, n)
      patch.current.opacity = 0.32 - n * 0.2
    }
    if (motes.current && moteMat.current) {
      moteMat.current.opacity = 0.85 - n * 0.6
      const arr = assets.motePos
      assets.seeds.forEach((m, i) => {
        const drift = reducedMotion ? 0 : t * 0.15
        const s = (m.s + drift * 0.2) % 1
        const [px, , pz] = project(m.x, m.y * s)
        arr[i * 3] = px + Math.sin(t * 0.4 + m.phase) * 0.08
        arr[i * 3 + 1] = m.y * (1 - s) + Math.sin(t * 0.6 + m.phase) * 0.05
        arr[i * 3 + 2] = pz
      })
      motes.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Behind the wall: only visible through the window */}
      <mesh position={[WINDOW.x, WINDOW.y, skyZ]}>
        <planeGeometry args={[WINDOW.w + 0.6, WINDOW.h + 0.6]} />
        <meshBasicMaterial ref={sky} />
      </mesh>
      <mesh position={[WINDOW.x - 0.5, winB - 0.6, skyZ + 0.04]}>
        <circleGeometry args={[1.1, 32]} />
        <meshBasicMaterial ref={hills} />
      </mesh>
      <mesh position={[WINDOW.x + 0.8, winB - 0.75, skyZ + 0.05]}>
        <circleGeometry args={[1.1, 32]} />
        <meshBasicMaterial color="#76bf88" />
      </mesh>
      <group ref={sun} position={[winR - 0.45, winT - 0.35, skyZ + 0.03]}>
        <mesh>
          <circleGeometry args={[0.24, 24]} />
          <meshBasicMaterial color="#ffd166" />
        </mesh>
      </group>
      <group ref={moon} position={[winR - 0.45, winB, skyZ + 0.03]}>
        <mesh>
          <circleGeometry args={[0.2, 24]} />
          <meshBasicMaterial color="#fff6d6" />
        </mesh>
        <mesh position={[0.08, 0.06, 0.005]}>
          <circleGeometry args={[0.16, 24]} />
          <meshBasicMaterial color="#211d52" />
        </mesh>
      </group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[assets.starPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={stars}
          size={0.07}
          map={assets.dot}
          color="#fffbe6"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>
      <group ref={clouds} position={[0, 0, skyZ + 0.06]}>
        {[winT - 0.55, winT - 0.95].map((y) => (
          <group key={y} position={[0, y, 0]}>
            {[
              [0, 0, 0.16],
              [0.18, 0.05, 0.2],
              [0.38, 0, 0.14],
            ].map(([cx, cy, r]) => (
              <mesh key={cx} position={[cx, cy, 0]}>
                <circleGeometry args={[r, 20]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Sunbeam, its patch on the floor, and dust floating in it */}
      <mesh geometry={assets.beam}>
        <meshBasicMaterial
          ref={beam}
          vertexColors
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh geometry={assets.patch}>
        <meshBasicMaterial ref={patch} transparent depthWrite={false} />
      </mesh>
      <points ref={motes}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[assets.motePos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={moteMat}
          size={0.05}
          map={assets.dot}
          color="#fff7d6"
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
