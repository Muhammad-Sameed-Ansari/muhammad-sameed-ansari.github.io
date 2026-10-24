import { useFrame, type ThreeElements, type ThreeEvent } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { goToObject } from '../Character/commands'
import { sfx } from '../lib/sound'
import type { ObjectId } from '../scene/objects'
import { useStore } from '../store/useStore'

type GroupProps = Omit<ThreeElements['group'], 'ref' | 'id'>

/**
 * Wraps a piece of furniture to make it interactive: hover cursor, a squishy bounce
 * when the character is nearby or the pointer is over it, and click-to-walk-and-use.
 *
 * The bounce scales about `pivot`, which defaults to the group's origin. Objects whose
 * children are placed in world coordinates must pass a pivot on their own wall or floor,
 * or the squish slides them across the room and into the walls.
 */
export function Interactive({
  id,
  pivot = [0, 0, 0],
  children,
  ...props
}: GroupProps & { id: ObjectId; pivot?: [number, number, number] }) {
  const group = useRef<Group>(null)
  const hovered = useRef(false)
  const energy = useRef(0)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const { nearId, hoverId, panel } = useStore.getState()
    const active = !panel && (nearId === id || hoverId === id)
    energy.current += ((active ? 1 : 0) - energy.current) * (1 - Math.exp(-8 * delta))
    const wobble = (Math.sin(state.clock.elapsedTime * 7) + 1) / 2
    const k = energy.current * wobble
    g.scale.set(1 + k * 0.012, 1 + k * 0.03, 1 + k * 0.012)
  })

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (hovered.current) return
    hovered.current = true
    document.body.style.cursor = 'pointer'
    useStore.getState().setHover(id)
  }
  const onOut = () => {
    hovered.current = false
    document.body.style.cursor = ''
    if (useStore.getState().hoverId === id) useStore.getState().setHover(null)
  }
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const { entered } = useStore.getState()
    if (e.delta > 8 || !entered) return
    sfx.click()
    goToObject(id)
  }

  return (
    <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} {...props}>
      <group position={pivot}>
        <group ref={group}>
          <group position={[-pivot[0], -pivot[1], -pivot[2]]}>{children}</group>
        </group>
      </group>
    </group>
  )
}
