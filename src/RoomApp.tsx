import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Experience } from './scene/Experience'
import { WorldOverlay } from './UI/WorldOverlay'
import { useStore } from './store/useStore'

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

  useEffect(() => {
    useStore.getState().setProgress(0.6)
  }, [])

  return (
    <div className={`room ${night ? 'is-night' : ''}`}>
      <Canvas
        className="room-canvas"
        shadows="percentage"
        flat
        dpr={[1, dpr]}
        camera={{ fov: 30, near: 0.1, far: 80, position: [12, 11, 12] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={() => useStore.getState().setProgress(0.8)}
        aria-label="Interactive 3D room. Use the quick navigation buttons or the classic view to browse content."
      >
        <PerformanceMonitor onDecline={() => setDpr(1.25)} onIncline={() => setDpr(2)} />
        <Suspense fallback={null}>
          <Experience />
          <ReadySignal />
        </Suspense>
      </Canvas>
      <WorldOverlay />
    </div>
  )
}
