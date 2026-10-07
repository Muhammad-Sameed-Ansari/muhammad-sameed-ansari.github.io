import { useState, type FormEvent } from 'react'
import { portfolio } from '../content/portfolio'
import { AvatarPortrait } from './AvatarPortrait'
import { PanelShell } from './Dialog'
import { SocialIcon } from './SocialIcon'

export default function ContactPanel() {
  const [copied, setCopied] = useState(false)

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const subject =
      String(data.get('subject') ?? '').trim() || `Hello from ${name || 'your portfolio'}`
    const message = String(data.get('message') ?? '').trim()
    const body = name ? `${message}\n\n${name}` : message
    window.location.href = `mailto:${portfolio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PanelShell id="contact" title="Send me a postcard" variant="contact">
      <div className="postcard">
        <form className="postcard-message" onSubmit={send}>
          <label>
            <span>Your name</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            <span>Subject</span>
            <input name="subject" placeholder="Let's build something" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={5} required />
          </label>
          <button className="btn btn-primary" type="submit">
            Open in my email app
          </button>
          <p className="postcard-fine">
            This opens your own email app with the message filled in. Nothing is sent from this
            page.
          </p>
        </form>
        <div className="postcard-address">
          <div className="stamp" aria-hidden="true">
            <AvatarPortrait config={portfolio.avatar} />
          </div>
          <div className="postmark" aria-hidden="true">
            <span>Hello</span>
          </div>
          <p className="postcard-to">To: {portfolio.name}</p>
          <ul className="social-list">
            {portfolio.socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target={s.icon === 'email' ? undefined : '_blank'} rel="noreferrer">
                  <SocialIcon icon={s.icon} />
                  <span>
                    <strong>{s.label}</strong>
                    <small>{s.handle}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <button className="btn-link" onClick={copyEmail}>
            {copied ? 'Email copied!' : `Copy ${portfolio.email}`}
          </button>
        </div>
      </div>
    </PanelShell>
  )
}
