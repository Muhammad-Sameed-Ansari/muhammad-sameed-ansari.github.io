import { useState, type CSSProperties } from 'react'
import { LEVELS } from '../content/format'
import { portfolio } from '../content/portfolio'
import type { Skill } from '../content/types'
import { PanelShell } from './Dialog'

/** Stable pseudo-random number from a string, so books keep their size between visits. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7) / 997

const SHELF_DECOR = ['🪴', '🏆', '🧸', '🕯️']

export default function SkillsPanel() {
  const [picked, setPicked] = useState<Skill | null>(null)

  return (
    <PanelShell id="skills" title="The bookshelf" variant="skills">
      <p className="panel-lede">
        Every book is something I work with. Pull one out to read how well I know it.
      </p>
      <div className="shelf-case">
        {portfolio.skills.map((cat) => (
          <section className="shelf" key={cat.name} aria-labelledby={`shelf-${cat.name}`}>
            <h3 className="shelf-label" id={`shelf-${cat.name}`}>
              {cat.name}
            </h3>
            <ul className="shelf-row">
              {cat.skills.map((skill) => {
                const r = hash(skill.name)
                const style = {
                  '--book': cat.color,
                  '--h': `${118 + r * 46}px`,
                  '--tilt': r > 0.9 ? '-3deg' : '0deg',
                } as CSSProperties
                return (
                  <li key={skill.name}>
                    <button
                      className="book"
                      style={style}
                      aria-pressed={picked?.name === skill.name}
                      onClick={() => setPicked(skill)}
                      onMouseEnter={() => setPicked(skill)}
                      onFocus={() => setPicked(skill)}
                    >
                      <span className="book-title">{skill.name}</span>
                      <span className="book-level" aria-hidden="true">
                        {'●'.repeat(skill.level)}
                      </span>
                      <span className="visually-hidden">{LEVELS[skill.level]}</span>
                    </button>
                  </li>
                )
              })}
              {/* Unlabelled filler books and a little decoration, so shelves look lived in */}
              {[0, 1, 2].map((n) => (
                <li
                  key={n}
                  aria-hidden="true"
                  className="book book-filler"
                  style={
                    { '--book': cat.color, '--h': `${104 + ((n * 37) % 40)}px` } as CSSProperties
                  }
                />
              ))}
              <li aria-hidden="true" className="shelf-deco">
                {SHELF_DECOR[portfolio.skills.indexOf(cat) % SHELF_DECOR.length]}
              </li>
            </ul>
          </section>
        ))}
      </div>
      <p className="shelf-note" aria-live="polite">
        {picked ? (
          <>
            <strong>{picked.name}</strong>: {LEVELS[picked.level]}
            <span className="shelf-meter" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= picked.level ? 'is-on' : ''} />
              ))}
            </span>
          </>
        ) : (
          'Hover over or tab to a book to read its spine.'
        )}
      </p>
    </PanelShell>
  )
}
