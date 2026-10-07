import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { char } from '../Character/runtime'

const RADIUS = 46

/** Optional on-screen thumbstick for touch devices. Writes a screen-space direction. */
export function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  useEffect(
    () => () => {
      char.stick.x = 0
      char.stick.y = 0
    },
    [],
  )

  const move = (e: PointerEvent) => {
    const rect = base.current!.getBoundingClientRect()
    let dx = e.clientX - (rect.left + rect.width / 2)
    let dy = e.clientY - (rect.top + rect.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS
      dy = (dy / len) * RADIUS
    }
    setKnob({ x: dx, y: dy })
    const dead = len < 8
    char.stick.x = dead ? 0 : dx / RADIUS
    char.stick.y = dead ? 0 : -dy / RADIUS
  }
  const release = () => {
    setKnob({ x: 0, y: 0 })
    char.stick.x = 0
    char.stick.y = 0
  }

  return (
    <div
      ref={base}
      className="joystick"
      aria-hidden="true"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e)
      }}
      onPointerMove={(e) => e.buttons && move(e)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="joystick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
