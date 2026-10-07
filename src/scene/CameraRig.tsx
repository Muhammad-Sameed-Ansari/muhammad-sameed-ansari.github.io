import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useEffect, useMemo } from 'react'
import { Vector3 } from 'three'
import { char } from '../Character/runtime'
import { usePrefersReducedMotion } from '../lib/media'
import { useStore } from '../store/useStore'
import { ROOM_CENTER } from './layout'
import { OBJECTS } from './objects'
import { view } from './runtime'

const PITCH = 0.62
const HALF_FOV = (30 / 2) * (Math.PI / 180)
const YAW_LIMIT = 0.5
const ZOOM_MIN = 0.62
const ZOOM_MAX = 1.3

/** Over-the-shoulder close-up of the laptop screen. */
const LAPTOP_CAM = new Vector3(0.2, 1.38, -2.2)
const LAPTOP_LOOK = new Vector3(-0.45, 0.85, -3.4)

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Isometric-style follow camera: eases after the character, frames objects when a
 * section is open, and allows a little drag-to-rotate and wheel/pinch zoom.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const dom = useThree((s) => s.gl.domElement)
  const reducedMotion = usePrefersReducedMotion()
  const tmp = useMemo(
    () => ({ pos: new Vector3(), look: new Vector3(), current: new Vector3(0, 0.8, 0) }),
    [],
  )

  useEffect(() => {
    const pointers = new Map<number, { x: number; y: number }>()
    let dragStartX = 0
    let yawStart = 0
    let pinchStart = 0
    let zoomStart = 1

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 1) {
        dragStartX = e.clientX
        yawStart = view.yaw
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinchStart = Math.hypot(a.x - b.x, a.y - b.y)
        zoomStart = view.zoom
      }
    }
    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 1) {
        const dx = e.clientX - dragStartX
        if (Math.abs(dx) > 8) view.yaw = clamp(yawStart - dx * 0.004, -YAW_LIMIT, YAW_LIMIT)
      } else if (pointers.size === 2 && pinchStart) {
        const [a, b] = [...pointers.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        view.zoom = clamp((zoomStart * pinchStart) / d, ZOOM_MIN, ZOOM_MAX)
      }
    }
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      if (pointers.size < 2) pinchStart = 0
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      view.zoom = clamp(view.zoom * (1 + e.deltaY * 0.001), ZOOM_MIN, ZOOM_MAX)
    }

    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    dom.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      dom.removeEventListener('wheel', onWheel)
    }
  }, [dom])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const { focus } = useStore.getState()
    const aspect = size.width / size.height
    const portrait = aspect < 0.9
    // Distance that fits a given width of the room on screen.
    const visibleWidth = portrait ? 6.5 : 12.5
    const baseDist = clamp(visibleWidth / 2 / (Math.tan(HALF_FOV) * aspect), 11, 26)
    const yaw = Math.PI / 4 + view.yaw

    const target = focus ? OBJECTS[focus].focus : undefined
    if (focus === 'projects') {
      tmp.pos.copy(LAPTOP_CAM)
      tmp.look.copy(LAPTOP_LOOK)
    } else {
      let dist = baseDist * view.zoom
      if (target) {
        tmp.look.set(...target.target)
        dist = baseDist * target.distance
      } else {
        const follow = portrait ? 0.92 : 0.4
        tmp.look.set(
          ROOM_CENTER.x + (char.x - ROOM_CENTER.x) * follow,
          0.75,
          ROOM_CENTER.z + (char.z - ROOM_CENTER.z) * follow,
        )
      }
      tmp.pos.set(
        tmp.look.x + Math.sin(yaw) * Math.cos(PITCH) * dist,
        tmp.look.y + Math.sin(PITCH) * dist,
        tmp.look.z + Math.cos(yaw) * Math.cos(PITCH) * dist,
      )
    }

    const smooth = reducedMotion ? 0.05 : 0.45
    easing.damp3(camera.position, tmp.pos, smooth, dt)
    easing.damp3(tmp.current, tmp.look, smooth * 0.8, dt)
    camera.lookAt(tmp.current)
  })

  return null
}
