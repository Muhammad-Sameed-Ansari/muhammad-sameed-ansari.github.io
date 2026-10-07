import { Outlines } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Object3D, type InstancedMesh } from 'three'
import { portfolio } from '../content/portfolio'
import { BOOKSHELF } from '../scene/layout'
import { Ball, Cyl, RBox } from '../scene/primitives'
import { INK, gradientMap } from '../scene/toon'
import { Interactive } from './Interactive'

const WOOD = '#d7a27a'
const BACK = '#f6d9b8'
const SHELF_GAP = 0.5
const BOOK_DEPTH = 0.34

interface Book {
  x: number
  y: number
  w: number
  h: number
  tilt: number
  color: Color
}

/** Lays out one shelf per skill category: one book per skill, then a few filler books. */
function layoutBooks(): Book[] {
  const books: Book[] = []
  const inner = BOOKSHELF.w - 0.2
  portfolio.skills.slice(0, 4).forEach((cat, row) => {
    const base = new Color(cat.color)
    const y = 0.11 + row * SHELF_GAP
    let x = -inner / 2
    let i = 0
    // Deterministic pseudo-random sizes so the shelf looks the same on every visit.
    const rand = (n: number) => (Math.sin((row + 1) * 91.7 + n * 12.9898) * 43758.5453) % 1
    const count = Math.max(cat.skills.length + 3, 8)
    while (i < count && x < inner / 2 - 0.1) {
      const r = Math.abs(rand(i))
      const w = 0.07 + r * 0.06
      const h = 0.3 + Math.abs(rand(i + 7)) * 0.12
      const filler = i >= cat.skills.length
      const color = base
        .clone()
        .offsetHSL(0, filler ? -0.25 : 0, (r - 0.5) * 0.12 + (filler ? 0.08 : 0))
      const tilt = i === count - 1 ? -0.25 : 0
      books.push({ x: x + w / 2, y, w, h, tilt, color })
      x += w + 0.008
      i++
    }
  })
  return books
}

const dummy = new Object3D()

function writeBook(mesh: InstancedMesh, i: number, b: Book, slide: number) {
  dummy.position.set(b.x, b.y + b.h / 2, slide)
  dummy.rotation.set(0, 0, b.tilt)
  dummy.scale.set(b.w, b.h, BOOK_DEPTH)
  dummy.updateMatrix()
  mesh.setMatrixAt(i, dummy.matrix)
}

/** Skills bookshelf. Books are instanced; the one under the pointer slides out. */
export function Bookshelf() {
  const books = useMemo(() => layoutBooks(), [])
  const mesh = useRef<InstancedMesh>(null)
  const hovered = useRef(-1)
  const offsets = useRef(new Float32Array(books.length))

  useLayoutEffect(() => {
    const m = mesh.current!
    books.forEach((b, i) => {
      writeBook(m, i, b, 0)
      m.setColorAt(i, b.color)
    })
    m.instanceMatrix.needsUpdate = true
  }, [books])

  useFrame((_, delta) => {
    let changed = false
    const k = 1 - Math.exp(-14 * Math.min(delta, 0.05))
    for (let i = 0; i < books.length; i++) {
      const target = i === hovered.current ? 0.12 : 0
      const cur = offsets.current[i]
      if (Math.abs(target - cur) < 0.0005) continue
      offsets.current[i] = cur + (target - cur) * k
      writeBook(mesh.current!, i, books[i], offsets.current[i])
      changed = true
    }
    if (changed) mesh.current!.instanceMatrix.needsUpdate = true
  })

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.instanceId !== undefined) hovered.current = e.instanceId
  }

  const { w, d, h } = BOOKSHELF
  return (
    <group position={[BOOKSHELF.x, 0, BOOKSHELF.z]} rotation={[0, Math.PI / 2, 0]}>
      <Interactive id="skills">
        <RBox
          size={[w, h, 0.04]}
          radius={0.015}
          color={BACK}
          position={[0, h / 2, -d / 2 + 0.02]}
        />
        {[-1, 1].map((side) => (
          <RBox
            key={side}
            size={[0.08, h, d]}
            radius={0.025}
            color={WOOD}
            position={[side * (w / 2 - 0.04), h / 2, 0]}
            castShadow
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <RBox
            key={i}
            size={[w, 0.06, d]}
            radius={0.02}
            color={WOOD}
            position={[0, 0.06 + i * SHELF_GAP, 0]}
            castShadow
          />
        ))}
        <RBox size={[w + 0.08, 0.07, d + 0.06]} radius={0.025} color={WOOD} position={[0, h, 0]} />
        <instancedMesh
          ref={mesh}
          args={[undefined, undefined, books.length]}
          position={[0, 0.03, 0.04 - d / 2 + BOOK_DEPTH / 2]}
          onPointerMove={onMove}
          onPointerOut={() => (hovered.current = -1)}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshToonMaterial gradientMap={gradientMap} />
          <Outlines thickness={0.012} color={INK} />
        </instancedMesh>
        {/* Decorations on top */}
        <group position={[-0.45, h + 0.035, 0]}>
          <Cyl r={0.11} rBottom={0.09} h={0.18} color="#ff8a80" position={[0, 0.09, 0]} />
          <Ball r={0.13} color="#7cc47f" position={[0, 0.27, 0]} scale={[1, 0.85, 1]} />
        </group>
        <group position={[0.4, h + 0.035, 0]}>
          <Cyl r={0.08} h={0.04} color="#8f88b5" position={[0, 0.02, 0]} />
          <Cyl r={0.025} h={0.12} color="#ffd166" position={[0, 0.1, 0]} />
          <Cyl r={0.09} rBottom={0.04} h={0.12} color="#ffd166" position={[0, 0.22, 0]} />
        </group>
      </Interactive>
    </group>
  )
}
