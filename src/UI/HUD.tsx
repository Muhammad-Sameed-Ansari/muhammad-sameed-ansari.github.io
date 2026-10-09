import { AnimatePresence, motion } from 'motion/react'
import { navigateTo } from '../Character/commands'
import { portfolio } from '../content/portfolio'
import { useCoarsePointer } from '../lib/media'
import { sfx } from '../lib/sound'
import { AvatarPortrait } from '../Panels/AvatarPortrait'
import { OBJECTS, SECTIONS } from '../scene/objects'
import { useStore } from '../store/useStore'
import { HelpCard } from './HelpCard'
import { Joystick } from './Joystick'
import './hud.css'

const firstName = portfolio.shortName

function FirstStepsHint() {
  const coarse = useCoarsePointer()
  return (
    <motion.p
      className="hud-hint"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 2.5 } }}
      exit={{ opacity: 0, y: 12 }}
    >
      {coarse ? (
        'Tap the floor to walk, tap glowing things to open them'
      ) : (
        <>
          Click the floor or use <kbd className="keycap">W</kbd>
          <kbd className="keycap">A</kbd>
          <kbd className="keycap">S</kbd>
          <kbd className="keycap">D</kbd> to walk, <kbd className="keycap">E</kbd> to use things
        </>
      )}
    </motion.p>
  )
}

/** Top bar (name, toggles) and the bottom quick-nav dock. */
export function HUD() {
  const entered = useStore((s) => s.entered)
  const panel = useStore((s) => s.panel)
  const night = useStore((s) => s.night)
  const sound = useStore((s) => s.sound)
  const joystick = useStore((s) => s.joystick)
  const hasMoved = useStore((s) => s.hasMoved)
  const helpOpen = useStore((s) => s.helpOpen)
  const coarse = useCoarsePointer()

  if (!entered) return null
  const st = useStore.getState

  return (
    <div className="hud" inert={!!panel}>
      <header className="hud-top">
        <div className="hud-badge">
          <AvatarPortrait config={portfolio.avatar} className="hud-avatar" />
          <div>
            <p className="hud-name">{portfolio.name}</p>
            <p className="hud-title">{portfolio.title}</p>
          </div>
        </div>
        <div className="hud-tools">
          {coarse && (
            <button
              className="icon-btn"
              aria-pressed={joystick}
              aria-label="On-screen joystick"
              title="On-screen joystick"
              onClick={() => st().toggleJoystick()}
            >
              🕹️
            </button>
          )}
          <button
            className="icon-btn"
            aria-pressed={sound}
            aria-label="Sound"
            title={sound ? 'Mute sound' : 'Turn sound on'}
            onClick={() => {
              st().toggleSound()
              sfx.pop()
            }}
          >
            {sound ? '🔊' : '🔇'}
          </button>
          <button
            className="icon-btn"
            aria-pressed={night}
            aria-label="Night mode"
            title={night ? 'Switch to day' : 'Switch to night'}
            onClick={() => {
              st().toggleNight()
              sfx.toggle()
            }}
          >
            {night ? '🌙' : '☀️'}
          </button>
          <button
            className="icon-btn"
            aria-expanded={helpOpen}
            aria-label="How to play"
            title="How to play"
            onClick={() => st().setHelpOpen(!helpOpen)}
          >
            ?
          </button>
          <button className="btn hud-classic" onClick={() => st().setMode('classic')}>
            Classic view
          </button>
        </div>
      </header>

      <AnimatePresence>{!hasMoved && <FirstStepsHint key="hint" />}</AnimatePresence>
      <AnimatePresence>{helpOpen && <HelpCard key="help" />}</AnimatePresence>
      {coarse && joystick && <Joystick />}

      <nav className="hud-dock" aria-label={`Sections of ${firstName}'s room`}>
        {SECTIONS.map((id) => (
          <button
            key={id}
            className="dock-btn"
            aria-current={panel === id ? 'true' : undefined}
            onClick={() => navigateTo(id)}
          >
            <span className="dock-emoji" aria-hidden="true">
              {OBJECTS[id].emoji}
            </span>
            <span className="dock-label">{OBJECTS[id].label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
