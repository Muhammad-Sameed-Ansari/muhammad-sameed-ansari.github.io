import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { anchors } from './anchors'

const v = new Vector3()

export function AnchorProjector() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  useFrame(() => {
    for (const a of anchors.values()) {
      if (!a.el) continue
      v.copy(a.pos).project(camera)
      const x = ((v.x + 1) / 2) * size.width
      const y = ((1 - v.y) / 2) * size.height
      a.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      a.el.style.visibility = v.z > 1 ? 'hidden' : ''
    }
  })
  return null
}
