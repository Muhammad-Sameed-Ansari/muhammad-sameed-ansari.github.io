import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { Color, Object3D, type InstancedMesh } from 'three'
import { MAX_PUFFS, pendingColors, pool } from './puffPool'
import { gradientMap } from './toon'

const dummy = new Object3D()
const tmpColor = new Color()

export function Puffs() {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current!
    for (let i = 0; i < MAX_PUFFS; i++) {
      dummy.scale.setScalar(0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, tmpColor.set('#ffffff'))
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((_, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const dt = Math.min(delta, 0.05)
    if (pendingColors.length) {
      for (const { index, color } of pendingColors) mesh.setColorAt(index, tmpColor.set(color))
      pendingColors.length = 0
      mesh.instanceColor!.needsUpdate = true
    }
    let anyAlive = false
    for (let i = 0; i < MAX_PUFFS; i++) {
      const p = pool[i]
      if (p.age >= p.life) {
        if (p.size) {
          p.size = 0
          dummy.scale.setScalar(0)
          dummy.updateMatrix()
          mesh.setMatrixAt(i, dummy.matrix)
          anyAlive = true
        }
        continue
      }
      anyAlive = true
      p.age += dt
      const t = Math.min(p.age / p.life, 1)
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
      p.vx *= 0.94
      p.vz *= 0.94
      // Pop in fast, shrink out slowly.
      const scale = p.size * (t < 0.15 ? t / 0.15 : 1 - ((t - 0.15) / 0.85) ** 2)
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(Math.max(scale, 0.0001))
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    if (anyAlive) mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MAX_PUFFS]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshToonMaterial gradientMap={gradientMap} />
    </instancedMesh>
  )
}
