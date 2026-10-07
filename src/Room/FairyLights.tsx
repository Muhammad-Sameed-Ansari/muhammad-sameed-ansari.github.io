import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { CatmullRomCurve3, Color, Object3D, Vector3, type InstancedMesh } from 'three'
import { ROOM } from '../scene/layout'
import { env } from '../scene/runtime'
import { INK } from '../scene/toon'

const COLORS = ['#ff8a80', '#ffd166', '#7fd6b4', '#7ec4f5', '#c3a6f0'].map((c) => new Color(c))
const PER_SAG = 6

/** A string of bulbs swagging along the top of the back and left walls. Glows at night. */
export function FairyLights() {
  const bulbs = useRef<InstancedMesh>(null)
  const { curve, points } = useMemo(() => {
    const y = ROOM.wallHeight - 0.25
    const z = ROOM.minZ + 0.06
    const x = ROOM.minX + 0.06
    // Along the left wall, round the corner, and along the back wall up to the clock.
    const anchors = [
      new Vector3(x, y, 1.6),
      new Vector3(x, y, -0.4),
      new Vector3(x, y, z),
      new Vector3(-2.9, y, z),
      new Vector3(-0.95, y, z),
    ]
    const pts: Vector3[] = []
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i]
      const b = anchors[i + 1]
      for (let k = 0; k < PER_SAG; k++) {
        const t = k / PER_SAG
        const p = a.clone().lerp(b, t)
        p.y -= Math.sin(t * Math.PI) * 0.28
        pts.push(p)
      }
    }
    pts.push(anchors[anchors.length - 1])
    return { curve: new CatmullRomCurve3(pts), points: pts }
  }, [])

  useLayoutEffect(() => {
    const mesh = bulbs.current!
    const o = new Object3D()
    points.forEach((p, i) => {
      o.position.copy(p).add(new Vector3(0, -0.06, 0))
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
      mesh.setColorAt(i, COLORS[i % COLORS.length])
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [points])

  const tmp = useMemo(() => new Color(), [])
  useFrame((state) => {
    const mesh = bulbs.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    const glow = 0.55 + env.night * 0.45
    for (let i = 0; i < points.length; i++) {
      const twinkle = env.night > 0.5 ? 0.85 + Math.sin(t * 2.2 + i * 1.7) * 0.15 : 1
      mesh.setColorAt(i, tmp.copy(COLORS[i % COLORS.length]).multiplyScalar(glow * twinkle))
    }
    mesh.instanceColor!.needsUpdate = true
  })

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 80, 0.008, 4, false]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <instancedMesh ref={bulbs} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
