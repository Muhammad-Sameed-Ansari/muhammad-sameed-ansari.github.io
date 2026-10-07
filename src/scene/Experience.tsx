import type { ThreeEvent } from '@react-three/fiber'
import { Character } from '../Character/Character'
import { ClickMarker } from '../Character/ClickMarker'
import { walkTo } from '../Character/commands'
import { Furniture } from '../Objects/Furniture'
import { Outside } from '../Room/Outside'
import { Room } from '../Room/Room'
import { useStore } from '../store/useStore'
import { AnchorProjector } from './AnchorProjector'
import { CameraRig } from './CameraRig'
import { InteractHint } from './InteractHint'
import { Lighting } from './Lighting'
import { Puffs } from './Puffs'

export function Experience() {
  // Anything without its own click handler acts as floor: walk to the nearest free spot.
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const { entered, panel } = useStore.getState()
    if (e.delta > 8 || !entered || panel) return
    walkTo(e.point.x, e.point.z)
  }

  return (
    <>
      <CameraRig />
      <AnchorProjector />
      <Lighting />
      <group onClick={onClick}>
        <Room />
        <Furniture />
      </group>
      <Outside />
      <Character />
      <ClickMarker />
      <InteractHint />
      <Puffs />
    </>
  )
}
