import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { navigateTo } from '../Character/commands'
import { OBJECTS, EASTER_EGGS } from '../scene/objects'
import { useStore } from '../store/useStore'

/** Controls cheat sheet plus keyboard access to every little easter egg. */
export function HelpCard() {
  const ref = useRef<HTMLDivElement>(null)
  const close = () => useStore.getState().setHelpOpen(false)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus()
    return () => previous?.focus()
  }, [])

  return (
    <motion.div
      ref={ref}
      className="help-card"
      role="dialog"
      aria-labelledby="help-title"
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.9, rotate: 2, y: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      onKeyDown={(e) => e.key === 'Escape' && close()}
    >
      <h2 id="help-title">How to get around</h2>
      <ul className="help-list">
        <li>
          <strong>Walk:</strong> click or tap the floor, or use <kbd className="keycap">W</kbd>
          <kbd className="keycap">A</kbd>
          <kbd className="keycap">S</kbd>
          <kbd className="keycap">D</kbd> / arrow keys
        </li>
        <li>
          <strong>Open things:</strong> click them, or stand close and press{' '}
          <kbd className="keycap">E</kbd>
        </li>
        <li>
          <strong>Close a panel:</strong> <kbd className="keycap">Esc</kbd> or the ✕ button
        </li>
        <li>
          <strong>Look around:</strong> drag to turn the camera, scroll or pinch to zoom
        </li>
      </ul>
      <h3>Little surprises</h3>
      <div className="help-eggs">
        {EASTER_EGGS.map((id) => (
          <button
            key={id}
            className="btn"
            onClick={() => {
              close()
              navigateTo(id)
            }}
          >
            <span aria-hidden="true">{OBJECTS[id].emoji}</span> {OBJECTS[id].label}
          </button>
        ))}
      </div>
      <button className="btn btn-primary help-done" onClick={close}>
        Got it
      </button>
    </motion.div>
  )
}
