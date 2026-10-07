import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { wave } from './Character/commands'
import { portfolio } from './content/portfolio'
import { Panels } from './Panels/Panels'
import { Experience } from './scene/Experience'
import { useStore } from './store/useStore'
import { HUD } from './UI/HUD'
import { useKeyboardControls } from './UI/useKeyboardControls'
import { WorldOverlay } from './UI/WorldOverlay'

/** Marks loading as complete once the scene has rendered a few frames (shaders compiled). */
function ReadySignal() {
  const frames = useRef(0)
  useFrame(() => {
    frames.current++
    if (frames.current === 4) useStore.getState().setProgress(1)
  })
  return null
}

export default function RoomApp() {
  const night = useStore((s) => s.night)
  const [dpr, setDpr] = useState(2)
  useKeyboardControls()

  useEffect(() => {
    useStore.getState().setProgress(0.6)
    // Greet the visitor the moment they step in.
    return useStore.subscribe((s, prev) => {
      if (s.entered && !prev.entered) {
        const tap = window.matchMedia('(pointer: coarse)').matches ? 'Tap' : 'Click'
        const first = portfolio.name.split(' ')[0]
        setTimeout(
          () => wave(`Hey! I'm ${first}. ${tap} anywhere to walk around my room 👋`, 6000),
          450,
        )
      }
    })
  }, [])

  return (
    <main className={`room ${night ? 'is-night' : ''}`}>
      <h1 className="visually-hidden">{portfolio.name}&rsquo;s interactive room</h1>
      <Canvas
        className="room-canvas"
        shadows="percentage"
        flat
        dpr={[1, dpr]}
        camera={{ fov: 30, near: 0.1, far: 80, position: [12, 11, 12] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={() => useStore.getState().setProgress(0.8)}
        role="img"
        aria-label="A cartoon developer bedroom. Use the section buttons at the bottom, or the classic view, to browse the content."
      >
        <PerformanceMonitor onDecline={() => setDpr(1.25)} onIncline={() => setDpr(2)} />
        <Suspense fallback={null}>
          <Experience />
          <ReadySignal />
        </Suspense>
      </Canvas>
      <WorldOverlay />
      <HUD />
      <Panels />
    </main>
  )
}
