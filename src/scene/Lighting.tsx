import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Color, type DirectionalLight, type HemisphereLight } from 'three'
import { useStore } from '../store/useStore'
import { env } from './runtime'

const SUN_DAY = new Color('#fff1dc')
const SUN_NIGHT = new Color('#8193ff')
const SKY_DAY = new Color('#fff4ea')
const SKY_NIGHT = new Color('#5c5ab0')
const GROUND_DAY = new Color('#d9b2e6')
const GROUND_NIGHT = new Color('#2a2350')

/** Sun/moon key light with soft shadows, plus a hemisphere fill. Also smooths env.night/lamp. */
export function Lighting() {
  const sun = useRef<DirectionalLight>(null)
  const hemi = useRef<HemisphereLight>(null)

  useFrame((_, delta) => {
    const { night, lampOn } = useStore.getState()
    const k = 1 - Math.exp(-3 * Math.min(delta, 0.05))
    env.night += ((night ? 1 : 0) - env.night) * k
    env.lamp += ((lampOn ? 1 : 0) - env.lamp) * k * 2
    const n = env.night
    if (sun.current) {
      sun.current.color.lerpColors(SUN_DAY, SUN_NIGHT, n)
      sun.current.intensity = 2.1 - n * 1.55
    }
    if (hemi.current) {
      hemi.current.color.lerpColors(SKY_DAY, SKY_NIGHT, n)
      hemi.current.groundColor.lerpColors(GROUND_DAY, GROUND_NIGHT, n)
      hemi.current.intensity = 1.5 - n * 0.75
    }
  })

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={sun}
        position={[6, 11, 6]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
    </>
  )
}
