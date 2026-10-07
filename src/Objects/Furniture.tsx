import { BEANBAG } from '../scene/layout'
import { Ball, RBox } from '../scene/primitives'
import { Bookshelf } from './Bookshelf'
import { Cat } from './Cat'
import { Chair } from './Chair'
import { ContactCorner } from './ContactCorner'
import { Corkboard } from './Corkboard'
import { Desk } from './Desk'
import { Interactive } from './Interactive'
import { Mirror } from './Mirror'
import { PCTower } from './PCTower'
import { Plant } from './Plant'
import { WallClock } from './WallClock'
import { WindowFrame } from '../Room/WindowFrame'

function Beanbag() {
  return (
    <group position={[BEANBAG.x, 0, BEANBAG.z]}>
      <Ball r={0.55} color="#ffd98a" position={[0, 0.3, 0]} scale={[1, 0.6, 1]} castShadow />
      <Ball r={0.3} color="#ffcf70" position={[-0.05, 0.42, 0.1]} scale={[1, 0.35, 1]} />
      {/* Game controller left on the beanbag */}
      <group position={[0.15, 0.55, 0.15]} rotation={[0.2, 0.6, 0]}>
        <RBox size={[0.22, 0.05, 0.11]} radius={0.025} color="#4b4868" outline={0.01} />
        <Ball r={0.018} color="#ff8a80" outline={false} position={[0.06, 0.03, 0]} segments={8} />
        <Ball r={0.018} color="#7fd6b4" outline={false} position={[-0.06, 0.03, 0]} segments={8} />
      </group>
    </group>
  )
}

export function Furniture() {
  return (
    <>
      <Desk />
      <Chair />
      <PCTower />
      <WallClock />
      <Bookshelf />
      <Corkboard />
      <Mirror />
      <ContactCorner />
      <Interactive id="window">
        <WindowFrame />
      </Interactive>
      <Plant />
      <Cat />
      <Beanbag />
    </>
  )
}
