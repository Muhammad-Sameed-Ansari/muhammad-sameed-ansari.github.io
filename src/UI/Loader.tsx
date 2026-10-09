import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { portfolio } from '../content/portfolio'
import { AvatarBust } from '../Panels/AvatarPortrait'
import { usePrefersReducedMotion } from '../lib/media'
import { unlockAudio } from '../lib/sound'
import { useStore } from '../store/useStore'
import './loader.css'

const INK = '#2d2541'
const CUP = 'M46 54 h96 l-8 78 a12 12 0 0 1 -12 10 h-56 a12 12 0 0 1 -12 -10 z'
const CUP_HANDLE = 'M140 70 h12 a20 20 0 0 1 0 40 h-16'

/**
 * The avatar says hi from the loading card: one hand waves (once the room is ready),
 * the other holds a mug whose coffee level shows loading progress.
 */
function LoaderAvatar({ level, ready }: { level: number; ready: boolean }) {
  const { avatar } = portfolio
  const top = 132 - level * 78
  const outline = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const }
  return (
    <svg
      className={`loader-avatar${ready ? ' is-ready' : ''}`}
      viewBox="0 0 260 248"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="loader-frame">
          <circle cx="130" cy="112" r="100" />
        </clipPath>
        <clipPath id="loader-cup-inside">
          <path d={CUP} />
        </clipPath>
      </defs>
      <circle cx="130" cy="112" r="100" fill="#cfe9ff" />
      {/* Waving arm sits behind the bust so the sleeve grows out of the shoulder. */}
      <g className="loader-wave">
        <path
          d="M84 196 Q50 178 42 140"
          fill="none"
          stroke={INK}
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M84 196 Q50 178 42 140"
          fill="none"
          stroke={avatar.hoodie}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <ellipse
          cx="51"
          cy="129"
          rx="5"
          ry="7"
          transform="rotate(-30 51 129)"
          fill={avatar.skin}
          {...outline}
        />
        <circle cx="38" cy="125" r="13" fill={avatar.skin} {...outline} />
      </g>
      <g clipPath="url(#loader-frame)">
        <g transform="translate(30 14)">
          <AvatarBust config={avatar} />
        </g>
      </g>
      {/* Mug arm, then the mug, then the hand around its handle. */}
      <path
        d="M182 198 Q194 226 214 216"
        fill="none"
        stroke={INK}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M182 198 Q194 226 214 216"
        fill="none"
        stroke={avatar.hoodie}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <g transform="translate(124.7 162.3) scale(0.55)">
        <g className="loader-steam" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round">
          <path d="M78 40 q-8 -10 0 -20 t0 -18" />
          <path d="M104 36 q-8 -10 0 -20 t0 -16" />
        </g>
        <path d={CUP_HANDLE} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
        <path d={CUP_HANDLE} fill="none" stroke="#ff8a7a" strokeWidth="6" strokeLinecap="round" />
        <path d={CUP} fill="#fffaf0" />
        <g clipPath="url(#loader-cup-inside)">
          <rect className="loader-coffee" x="30" y={top} width="130" height="120" fill="#a0613d" />
          <rect className="loader-coffee" x="30" y={top} width="130" height="9" fill="#d9a07a" />
        </g>
        <path d={CUP} fill="none" stroke={INK} strokeWidth="7" strokeLinejoin="round" />
      </g>
      <ellipse cx="216" cy="211" rx="10" ry="12" fill={avatar.skin} {...outline} />
      <path d="M207 207 h6 M207 214 h6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
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
        <div className="loader-hero">
          <LoaderAvatar level={level} ready={ready} />
          {ready && (
            <motion.p
              className="loader-bubble"
              initial={reducedMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.1 }}
            >
              <span>Come on in,</span> <span>the coffee&rsquo;s ready!</span>
            </motion.p>
          )}
        </div>
        <h2 className="loader-title" id="loader-title">
          {portfolio.name}
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
