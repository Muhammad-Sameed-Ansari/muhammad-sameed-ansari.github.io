import { useLayoutEffect, useRef, useState } from 'react'
import { dateRange } from '../content/format'
import { portfolio } from '../content/portfolio'
import type { TimelineEntry } from '../content/types'
import { PanelShell } from './Dialog'

const NOTE_COLORS = ['#ffe08a', '#bfe3ff', '#ffd0dc', '#c9f2dc', '#e3d6ff']

function Note({
  entry,
  index,
  kind,
}: {
  entry: TimelineEntry
  index: number
  kind: 'work' | 'school'
}) {
  return (
    <li
      className={`note note-${kind}`}
      style={{
        background: kind === 'work' ? NOTE_COLORS[index % NOTE_COLORS.length] : undefined,
        rotate: `${index % 2 ? 1.6 : -1.4}deg`,
      }}
    >
      <span className="pin" aria-hidden="true" />
      <p className="note-date">{dateRange(entry)}</p>
      <h4 className="note-title">{entry.title}</h4>
      <p className="note-org">
        {entry.org}
        {entry.location && <span className="note-loc">, {entry.location}</span>}
      </p>
      {entry.highlights.length > 0 && (
        <ul className="note-points">
          {entry.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** Red string from pin to pin, in reading order, measured from the laid-out notes. */
function useString(board: React.RefObject<HTMLDivElement | null>) {
  const [path, setPath] = useState('')
  useLayoutEffect(() => {
    const el = board.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const pts = [...el.querySelectorAll<HTMLElement>('.pin')].map((pin) => {
        const note = pin.offsetParent as HTMLElement
        const list = note.offsetParent as HTMLElement
        return [
          list.offsetLeft + note.offsetLeft + pin.offsetLeft + pin.offsetWidth / 2,
          list.offsetTop + note.offsetTop + pin.offsetTop + pin.offsetHeight / 2,
        ]
      })
      setPath(
        pts
          .map(([x, y], i) => {
            if (i === 0) return `M${x} ${y}`
            const [px, py] = pts[i - 1]
            // Let the string sag a little between pins.
            return `Q${(px + x) / 2} ${Math.max(py, y) + 26} ${x} ${y}`
          })
          .join(' '),
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [board])
  return path
}

export default function ExperiencePanel() {
  const board = useRef<HTMLDivElement>(null)
  const path = useString(board)

  return (
    <PanelShell id="experience" title="The corkboard" variant="experience">
      <div className="cork" ref={board}>
        <svg className="cork-string" aria-hidden="true">
          <path d={path} />
        </svg>
        <h3 className="cork-tag">Work</h3>
        <ol className="notes">
          {portfolio.experience.map((e, i) => (
            <Note key={`${e.org}-${e.title}`} entry={e} index={i} kind="work" />
          ))}
        </ol>
        <h3 className="cork-tag">Education &amp; certificates</h3>
        <ol className="notes">
          {portfolio.education.map((e, i) => (
            <Note key={`${e.org}-${e.title}`} entry={e} index={i + 1} kind="school" />
          ))}
        </ol>
      </div>
    </PanelShell>
  )
}
