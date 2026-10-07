import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { portfolio } from '../content/portfolio'
import { usePrefersReducedMotion } from '../lib/media'
import { unlockAudio } from '../lib/sound'
import { useStore } from '../store/useStore'
import './loader.css'

/** Coffee cup whose coffee level shows loading progress. */
function CoffeeCup({ level }: { level: number }) {
  const top = 132 - level * 78
  return (
    <svg className="loader-cup" viewBox="0 0 200 180" aria-hidden="true">
      <defs>
        <clipPath id="cup-inside">
          <path d="M46 54 h96 l-8 78 a12 12 0 0 1 -12 10 h-56 a12 12 0 0 1 -12 -10 z" />
        </clipPath>
      </defs>
      <g
        className="loader-steam"
        fill="none"
        stroke="#2d2541"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M78 40 q-8 -10 0 -20 t0 -18" />
        <path d="M104 36 q-8 -10 0 -20 t0 -16" />
      </g>
      <path
        d="M140 70 h12 a20 20 0 0 1 0 40 h-16"
        fill="none"
        stroke="#2d2541"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M140 70 h12 a20 20 0 0 1 0 40 h-16"
        fill="none"
        stroke="#ff8a7a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M46 54 h96 l-8 78 a12 12 0 0 1 -12 10 h-56 a12 12 0 0 1 -12 -10 z" fill="#fffaf0" />
      <g clipPath="url(#cup-inside)">
        <rect className="loader-coffee" x="30" y={top} width="130" height="120" fill="#a0613d" />
        <rect x="30" y={top} width="130" height="7" fill="#d9a07a" className="loader-coffee" />
      </g>
      <path
        d="M46 54 h96 l-8 78 a12 12 0 0 1 -12 10 h-56 a12 12 0 0 1 -12 -10 z"
        fill="none"
        stroke="#2d2541"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <ellipse cx="94" cy="160" rx="64" ry="9" fill="#2d2541" opacity="0.15" />
    </svg>
  )
}

export function Loader() {
  const progress = useStore((s) => s.progress)
  const setMode = useStore((s) => s.setMode)
  const reducedMotion = usePrefersReducedMotion()
  const ready = progress >= 1
  // Ease the bar along while chunks download, so it never looks frozen.
  const [creep, setCreep] = useState(0.08)
  useEffect(() => {
    const id = setInterval(() => setCreep((c) => Math.min(0.88, c + (0.9 - c) * 0.06)), 120)
    return () => clearInterval(id)
  }, [])
  const level = ready ? 1 : Math.max(progress * 0.95, creep)

  const enter = () => {
    unlockAudio()
    useStore.getState().enter()
  }

  return (
    <motion.div
      className="loader"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loader-title"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45 }}
    >
      <div className="loader-card">
        <CoffeeCup level={level} />
        <h2 className="loader-title" id="loader-title">
          {portfolio.name}&rsquo;s room
        </h2>
        <p className="loader-sub">{portfolio.title}</p>
        <div className="loader-action" aria-live="polite">
          {ready ? (
            <motion.button
              className="btn btn-primary btn-big"
              onClick={enter}
              autoFocus
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 16 }}
            >
              Enter my room
            </motion.button>
          ) : (
            <p className="loader-status">Brewing the room… {Math.round(level * 100)}%</p>
          )}
        </div>
        {reducedMotion && (
          <p className="loader-note">
            Your device asks for reduced motion. The classic view has the same content, without the
            animation.
          </p>
        )}
        <button className="btn-link" onClick={() => setMode('classic')}>
          In a hurry? Open the classic view
        </button>
      </div>
    </motion.div>
  )
}
