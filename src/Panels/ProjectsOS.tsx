import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { closeSection } from '../Character/commands'
import {
  filterSummary,
  isMobile,
  isWeb,
  matchesFilter,
  mobilePlatformsLine,
  mobileView,
  platformLabel,
  primaryView,
  PROJECT_FILTERS,
  storeLabel,
  type ProjectFilter,
  type ProjectView,
} from '../content/format'
import { portfolio } from '../content/portfolio'
import { asset } from '../lib/asset'
import type { Project } from '../content/types'
import { sfx } from '../lib/sound'
import { DeviceFrame } from './DeviceFrame'
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

interface SegmentOption<T extends string> {
  id: T
  label: string
  icon?: string
}

/** Row of toggle buttons where exactly one is pressed, e.g. a view or filter switch. */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
  ref,
}: {
  label: string
  options: SegmentOption<T>[]
  value: T
  onChange: (id: T) => void
  className?: string
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      className={`os-segmented${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === value}
          onClick={() => {
            if (o.id === value) return
            sfx.click()
            onChange(o.id)
          }}
        >
          {o.icon && <span aria-hidden="true">{o.icon} </span>}
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Desktop icon badge and the matching words for screen readers. */
const iconBadge = (p: Project) =>
  isWeb(p) && isMobile(p)
    ? { badge: '🌐📱', spoken: 'web and mobile app' }
    : isMobile(p)
      ? { badge: '📱', spoken: 'mobile app' }
      : { badge: '🌐', spoken: 'website' }

function ProjectBody({ project }: { project: Project }) {
  const [shot, setShot] = useState(0)
  const [view, setView] = useState<ProjectView>(() => primaryView(project))
  const count = project.images.length
  const device = mobileView(project)
  const mixed = isWeb(project) && isMobile(project)

  const details = (
    <>
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

  return (
    <>
      <div className="os-platform-row">
        <div className="os-platforms">
          <span className="os-platforms-label" id={`${project.id}-runs-on`}>
            Runs on
          </span>
          <ul aria-labelledby={`${project.id}-runs-on`}>
            {project.platforms.map((pl) => (
              <li key={pl}>
                {pl === 'web' && <span aria-hidden="true">🌐 </span>}
                {platformLabel(pl)}
              </li>
            ))}
          </ul>
        </div>
        {mixed && (
          <Segmented
            label="View"
            options={[
              { id: 'web', label: 'Web', icon: '🌐' },
              { id: device, label: device === 'tablet' ? 'Tablet' : 'Mobile', icon: '📱' },
            ]}
            value={view}
            onChange={setView}
          />
        )}
      </div>
      {view === 'web' ? (
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
          {details}
        </>
      ) : (
        <div className="os-device-view">
          <div className={`os-device-layout os-device-${device}`}>
            <div className="os-device">
              <DeviceFrame
                variant={device}
                shots={device === 'tablet' ? project.tabletShots : project.phoneShots}
                title={project.title}
                icon={project.icon}
                color={project.color}
                caption={mobilePlatformsLine(project)}
              />
            </div>
            <div className="os-device-text">{details}</div>
          </div>
        </div>
      )}
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
  const filterGroup = useRef<HTMLDivElement>(null)
  const [win, setWin] = useState<WindowId | null>(null)
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const shown = portfolio.projects.filter((p) => matchesFilter(p, filter))

  const open = (w: WindowId, el: HTMLButtonElement) => {
    lastIcon.current = el
    sfx.pop()
    setWin(w)
  }
  const closeWindow = () => {
    sfx.click()
    setWin(null)
    // The icon may have been filtered away while its window was open.
    if (lastIcon.current?.isConnected) lastIcon.current.focus()
    else filterGroup.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.focus()
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
            <Segmented
              ref={filterGroup}
              label="Show projects"
              options={PROJECT_FILTERS}
              value={filter}
              onChange={setFilter}
              className="os-filter"
            />
            <span className="visually-hidden" aria-live="polite">
              {filterSummary(filter, shown.length)}
            </span>
            <span className="os-clock">{time}</span>
            <button className="os-standup" onClick={closeSection}>
              Stand up
            </button>
          </header>
          <div className="os-desktop" ref={desktop}>
            <ul className="os-icons" aria-label="Projects">
              {shown.map((p) => {
                const { badge, spoken } = iconBadge(p)
                return (
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
                        <span className="os-icon-badge">{badge}</span>
                      </span>
                      <span className="os-icon-label">
                        {p.title}
                        <span className="visually-hidden">, {spoken}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
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
                        The 🌐 and 📱 badges show whether a project runs on the web, on phones and
                        tablets, or both, and the All · Web · Mobile switch in the menu bar filters
                        the desktop.
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
