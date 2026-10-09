import { useEffect } from 'react'
import { dateRange, LEVELS } from '../content/format'
import { portfolio } from '../content/portfolio'
import { asset } from '../lib/asset'
import type { TimelineEntry } from '../content/types'
import { hasWebGL } from '../lib/media'
import { AvatarPortrait } from '../Panels/AvatarPortrait'
import { SocialIcon } from '../Panels/SocialIcon'
import { useStore } from '../store/useStore'
import './classic.css'

function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className="c-timeline">
      {items.map((e) => (
        <li key={`${e.org}-${e.title}`}>
          <p className="c-date">{dateRange(e)}</p>
          <h3>{e.title}</h3>
          <p className="c-org">
            {e.org}
            {e.location && `, ${e.location}`}
          </p>
          {e.highlights.length > 0 && (
            <ul>
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}

/** Plain, fast, fully accessible single-page version of the same content. */
export default function ClassicView() {
  const setMode = useStore((s) => s.setMode)
  const p = portfolio
  const webgl = hasWebGL()

  useEffect(() => {
    document.documentElement.classList.add('is-classic')
    return () => document.documentElement.classList.remove('is-classic')
  }, [])

  return (
    <div className="classic">
      <a className="c-skip" href="#main">
        Skip to content
      </a>
      <header className="c-header">
        <AvatarPortrait config={p.avatar} className="c-avatar" />
        <div>
          <h1>{p.name}</h1>
          <p className="c-title">
            {p.title}, {p.location}
          </p>
        </div>
        <nav aria-label="Sections" className="c-nav">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="main" className="c-main">
        <section aria-labelledby="about-h">
          <h2 id="about-h" className="visually-hidden">
            About
          </h2>
          {p.bio.map((para) => (
            <p key={para} className="c-lede">
              {para}
            </p>
          ))}
          <div className="c-actions">
            <a className="btn btn-primary" href={asset(p.resumeUrl)} download>
              Download résumé (PDF)
            </a>
            <a className="btn" href={`mailto:${p.email}`}>
              Email me
            </a>
            {webgl && (
              <button className="btn" onClick={() => setMode('room')}>
                Explore the 3D room
              </button>
            )}
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-h">
          <h2 id="projects-h">Projects</h2>
          <ul className="c-projects">
            {p.projects.map((proj) => (
              <li key={proj.id} className="c-project">
                {proj.images[0] && (
                  <img src={asset(proj.images[0])} alt="" loading="lazy" width={640} height={400} />
                )}
                <div className="c-project-body">
                  <h3>
                    <span aria-hidden="true">{proj.icon}</span> {proj.title}{' '}
                    <span className="c-year">{proj.year}</span>
                  </h3>
                  <p className="c-tagline">{proj.tagline}</p>
                  {proj.role && <p className="c-role">{proj.role}</p>}
                  <p>{proj.description}</p>
                  <p className="c-tech">
                    <span className="visually-hidden">Built with: </span>
                    {proj.tech.join(', ')}
                  </p>
                  <p className="c-links">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer">
                        Live site<span className="visually-hidden"> of {proj.title}</span>
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer">
                        Source code<span className="visually-hidden"> of {proj.title}</span>
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="skills" aria-labelledby="skills-h">
          <h2 id="skills-h">Skills</h2>
          <div className="c-skills">
            {p.skills.map((cat) => (
              <div key={cat.name} className="c-skill-group" style={{ borderColor: cat.color }}>
                <h3>{cat.name}</h3>
                <ul>
                  {cat.skills.map((s) => (
                    <li key={s.name}>
                      {s.name} <span className="c-level">{LEVELS[s.level]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h">
          <h2 id="experience-h">Experience</h2>
          <Timeline items={p.experience} />
          <h2>Education &amp; certificates</h2>
          <Timeline items={p.education} />
        </section>

        <section id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">Contact</h2>
          <ul className="c-socials">
            {p.socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target={s.icon === 'email' ? undefined : '_blank'} rel="noreferrer">
                  <SocialIcon icon={s.icon} />
                  {s.label}: {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="c-footer">
        <p>
          © {new Date().getFullYear()} {p.name}
        </p>
      </footer>
    </div>
  )
}
