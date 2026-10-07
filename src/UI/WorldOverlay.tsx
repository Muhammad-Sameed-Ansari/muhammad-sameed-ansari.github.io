import { AnimatePresence, motion } from 'motion/react'
import { goToObject } from '../Character/commands'
import { portfolio } from '../content/portfolio'
import { useCoarsePointer } from '../lib/media'
import { getAnchor } from '../scene/anchors'
import { OBJECTS, type ObjectId } from '../scene/objects'
import { useStore } from '../store/useStore'
import { useCatMeow } from './useCatMeow'
import { WorldAnchor } from './WorldAnchor'

for (const o of Object.values(OBJECTS)) getAnchor(`label:${o.id}`).pos.set(...o.labelPos)
getAnchor('cat').pos.set(
  OBJECTS.cat.labelPos[0],
  OBJECTS.cat.labelPos[1] - 0.1,
  OBJECTS.cat.labelPos[2],
)

const pop = {
  initial: { opacity: 0, scale: 0.6, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 4 },
  transition: { type: 'spring', stiffness: 460, damping: 24 },
} as const

function ProximityLabel({ id, near }: { id: ObjectId; near: boolean }) {
  const coarse = useCoarsePointer()
  const o = OBJECTS[id]
  const hint = near && !coarse ? <kbd className="keycap">E</kbd> : null
  return (
    <motion.button
      type="button"
      className={`proximity-label ${near ? 'is-near' : ''}`}
      tabIndex={-1}
      onClick={() => goToObject(id)}
      {...pop}
    >
      <span aria-hidden="true">{o.emoji}</span> {o.label}
      {hint}
    </motion.button>
  )
}

/** DOM layer for things that float over the 3D room: speech bubbles and proximity labels. */
export function WorldOverlay() {
  const speech = useStore((s) => s.speech)
  const nearId = useStore((s) => s.nearId)
  const hoverId = useStore((s) => s.hoverId)
  const panel = useStore((s) => s.panel)
  const entered = useStore((s) => s.entered)
  const meow = useCatMeow()
  const active = !entered || panel ? null : (hoverId ?? nearId)
  // The cat's own bubble takes the label's spot while it meows.
  const labelId = active === 'cat' && meow ? null : active

  return (
    <div className="world-overlay">
      {Object.values(OBJECTS).map((o) => (
        <WorldAnchor key={o.id} id={`label:${o.id}`}>
          <AnimatePresence>
            {labelId === o.id && <ProximityLabel id={o.id} near={nearId === o.id} />}
          </AnimatePresence>
        </WorldAnchor>
      ))}
      <WorldAnchor id="cat">
        <AnimatePresence>
          {meow > 0 && (
            <motion.div key={meow} className="speech-bubble is-small" {...pop}>
              Meow! 💕
            </motion.div>
          )}
        </AnimatePresence>
      </WorldAnchor>
      <WorldAnchor id="speech">
        <AnimatePresence>
          {speech && (
            <motion.div key={speech.id} className="speech-bubble" {...pop}>
              {speech.text}
            </motion.div>
          )}
        </AnimatePresence>
      </WorldAnchor>
      <p className="visually-hidden" aria-live="polite">
        {speech?.text}
        {meow > 0 && ` ${portfolio.petName} says meow.`}
      </p>
    </div>
  )
}
