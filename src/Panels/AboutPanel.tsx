import { openSection } from '../Character/commands'
import { portfolio } from '../content/portfolio'
import { AvatarPortrait } from './AvatarPortrait'
import { PanelShell } from './Dialog'

export default function AboutPanel() {
  return (
    <PanelShell id="about" title="In the mirror" variant="about">
      <div className="about-grid">
        <figure className="mirror-frame">
          <AvatarPortrait
            config={portfolio.avatar}
            title={`Cartoon portrait of ${portfolio.name}`}
          />
        </figure>
        <div className="about-text">
          <p className="about-name">{portfolio.name}</p>
          <p className="about-role">
            {portfolio.title}, {portfolio.location}
          </p>
          {portfolio.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="about-actions">
            <a className="btn btn-primary" href={portfolio.resumeUrl} download>
              Download résumé (PDF)
            </a>
            <button className="btn" onClick={() => openSection('contact')}>
              Say hi
            </button>
          </div>
        </div>
      </div>
      <section className="fact-card" aria-labelledby="facts-title">
        <h3 id="facts-title">Fun facts</h3>
        <ul>
          {portfolio.funFacts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
    </PanelShell>
  )
}
