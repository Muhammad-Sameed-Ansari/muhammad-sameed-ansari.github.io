import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { closeSection } from '../Character/commands'
import { storeLabel } from '../content/format'
import { portfolio } from '../content/portfolio'
import { asset } from '../lib/asset'
import type { Project } from '../content/types'
import { sfx } from '../lib/sound'
import { Dialog } from './Dialog'
import './os.css'

const firstName = portfolio.shortName

type WindowId = { kind: 'project'; project: Project } | { kind: 'readme' } | { kind: 'trash' }

const timeNow = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

function useClock() {
  const [time, setTime] = useState(timeNow)
  useEffect(() => {
    const id = setInterval(() => setTime(timeNow()), 10_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function ProjectBody({ project }: { project: Project }) {
  const [shot, setShot] = useState(0)
  const count = project.images.length
  return (
    <>
      {count > 0 && (
        <div className="os-gallery">
          <img
            src={asset(project.images[shot])}
            alt={`${project.title}, screenshot ${shot + 1} of ${count}`}
            loading="lazy"
            width={640}
            height={400}
          />
          {count > 1 && (
            <div className="os-gallery-nav">
              <button
                className="icon-btn"
                aria-label="Previous screenshot"
                onClick={() => setShot((shot - 1 + count) % count)}
              >
                ‹
              </button>
              <span>
                {shot + 1} / {count}
              </span>
              <button
                className="icon-btn"
                aria-label="Next screenshot"
                onClick={() => setShot((shot + 1) % count)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
      <p className="os-tagline">{project.tagline}</p>
      {project.role && <p className="os-role">{project.role}</p>}
      <p>{project.description}</p>
      <h4 className="os-subhead">Built with</h4>
      <ul className="chips">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="os-links">
        {project.liveUrl && (
          <a className="btn btn-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
            Visit live site
          </a>
        )}
        {project.repoUrl && (
          <a className="btn" href={project.repoUrl} target="_blank" rel="noreferrer">
            View source code
          </a>
        )}
        {project.stores?.map((s) => (
          <a key={s.url} className="btn" href={s.url} target="_blank" rel="noreferrer">
            {storeLabel(s)}
          </a>
        ))}
      </div>
    </>
  )
}

function OSWindow({
  title,
  onClose,
  bounds,
  children,
}: {
  title: string
  onClose: () => void
  bounds: React.RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const controls = useDragControls()
  const closeBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => closeBtn.current?.focus(), [])
  return (
    <motion.section
      className="os-window"
      aria-label={title}
      drag
      dragControls={controls}
      dragListener={false}
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: 20 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <div className="os-titlebar" onPointerDown={(e) => controls.start(e)}>
        <button
          ref={closeBtn}
          className="os-dot os-dot-close"
          aria-label="Close window"
          onClick={onClose}
        />
        <span className="os-dot os-dot-min" aria-hidden="true" />
        <span className="os-dot os-dot-max" aria-hidden="true" />
        <h3 className="os-window-title">{title}</h3>
      </div>
      <div className="os-window-body">{children}</div>
    </motion.section>
  )
}

export default function ProjectsOS() {
  const time = useClock()
  const desktop = useRef<HTMLDivElement>(null)
  const lastIcon = useRef<HTMLButtonElement | null>(null)
  const [win, setWin] = useState<WindowId | null>(null)

  const open = (w: WindowId, el: HTMLButtonElement) => {
    lastIcon.current = el
    sfx.pop()
    setWin(w)
  }
  const closeWindow = () => {
    sfx.click()
    setWin(null)
    lastIcon.current?.focus()
  }

  const title =
    win?.kind === 'project' ? win.project.title : win?.kind === 'readme' ? 'README.txt' : 'Trash'

  return (
    <Dialog
      labelledBy="os-title"
      className="os"
      enter={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      onEscape={() => {
        if (!win) return false
        closeWindow()
        return true
      }}
    >
      <div className="os-bezel">
        <div className="os-screen">
          <header className="os-menubar">
            <h2 id="os-title" className="os-brand">
              <span aria-hidden="true">🍩</span> {firstName}OS
            </h2>
            <span className="os-clock">{time}</span>
            <button className="os-standup" onClick={closeSection}>
              Stand up
            </button>
          </header>
          <div className="os-desktop" ref={desktop}>
            <ul className="os-icons" aria-label="Projects">
              {portfolio.projects.map((p) => (
                <li key={p.id}>
                  <button
                    className="os-icon"
                    onClick={(e) => open({ kind: 'project', project: p }, e.currentTarget)}
                  >
                    <span
                      className="os-icon-tile"
                      style={{ background: p.color }}
                      aria-hidden="true"
                    >
                      {p.icon}
                    </span>
                    <span className="os-icon-label">{p.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="os-icon"
                  onClick={(e) => open({ kind: 'readme' }, e.currentTarget)}
                >
                  <span className="os-icon-tile os-icon-file" aria-hidden="true">
                    📝
                  </span>
                  <span className="os-icon-label">README.txt</span>
                </button>
              </li>
              <li>
                <button
                  className="os-icon"
                  onClick={(e) => open({ kind: 'trash' }, e.currentTarget)}
                >
                  <span className="os-icon-tile os-icon-file" aria-hidden="true">
                    🗑️
                  </span>
                  <span className="os-icon-label">Trash</span>
                </button>
              </li>
            </ul>
            <AnimatePresence>
              {win && (
                <OSWindow key={title} title={title} onClose={closeWindow} bounds={desktop}>
                  {win.kind === 'project' && <ProjectBody project={win.project} />}
                  {win.kind === 'readme' && (
                    <div className="os-readme">
                      <p>Welcome to {firstName}OS!</p>
                      <p>
                        Every app icon on this desktop is a project. Open one to see screenshots,
                        what it is built with, and links to try it.
                      </p>
                      <p>
                        Drag a window by its title bar. Press Esc to close a window, and Esc again
                        to stand up from the desk.
                      </p>
                    </div>
                  )}
                  {win.kind === 'trash' && (
                    <p className="os-readme">
                      The trash is empty. Every bug in here has been squashed. Mostly.
                    </p>
                  )}
                </OSWindow>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
