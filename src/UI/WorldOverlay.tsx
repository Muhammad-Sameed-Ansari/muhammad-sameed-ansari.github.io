import { AnimatePresence, motion } from 'motion/react'
import { WorldAnchor } from './WorldAnchor'
import { useStore } from '../store/useStore'

/** DOM layer for things that float over the 3D room: the speech bubble and proximity labels. */
export function WorldOverlay() {
  const speech = useStore((s) => s.speech)
  return (
    <div className="world-overlay">
      <WorldAnchor id="speech">
        <AnimatePresence>
          {speech && (
            <motion.div
              key={speech.id}
              className="speech-bubble"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -6 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            >
              {speech.text}
            </motion.div>
          )}
        </AnimatePresence>
      </WorldAnchor>
      <p className="visually-hidden" aria-live="polite">
        {speech?.text}
      </p>
    </div>
  )
}
