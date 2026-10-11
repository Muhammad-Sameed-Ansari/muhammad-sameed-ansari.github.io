import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { portfolio } from '../content/portfolio'

/** "Which plan?" choices. The extra ones cover visitors who aren't ready to pick. */
export const CALL_TOPIC = 'A free 15-min call'
const UNSURE_TOPIC = 'Not sure yet'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Enquiry form that emails Sameed through FormSubmit (free, no backend). The "Ask about"
 * buttons preselect a plan and move focus here.
 */
export function EnquiryForm({ topic, focusKey }: { topic: string; focusKey: number }) {
  const { hire, email } = portfolio
  const id = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const [choice, setChoice] = useState(topic)
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const [seenKey, setSeenKey] = useState(focusKey)
  const topics = [...hire.plans.map((p) => p.name), UNSURE_TOPIC, CALL_TOPIC]

  // A button was pressed: follow its choice and reopen the form if it was showing "sent".
  if (focusKey !== seenKey) {
    setSeenKey(focusKey)
    setChoice(topic)
    if (status !== 'sending') setStatus('idle')
  }

  // Then bring the form into view.
  useEffect(() => {
    if (!focusKey) return
    nameRef.current?.closest('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    nameRef.current?.focus({ preventScroll: true })
  }, [focusKey])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${hire.formSubmitId ?? email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Portfolio enquiry: ${data.topic}`,
          _template: 'table',
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean }
      if (!res.ok || String(json.success) !== 'true') throw new Error('not sent')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const direct = (
    <>
      <a href={`mailto:${email}`}>{email}</a>{' '}
      <button type="button" className="enquiry-copy" onClick={copy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </>
  )

  if (status === 'sent') {
    return (
      <div className="enquiry enquiry-sent" role="status">
        <p className="enquiry-title">
          <span aria-hidden="true">📬</span> Thanks, your message is on its way.
        </p>
        <p>I usually reply within one working day. Check your inbox (and spam folder).</p>
        <button type="button" className="btn" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="enquiry" onSubmit={onSubmit} aria-labelledby={`${id}-title`}>
      <p className="enquiry-title" id={`${id}-title`}>
        Tell me about your product
      </p>
      <div className="enquiry-grid">
        <label>
          <span>Your name</span>
          <input ref={nameRef} name="name" required autoComplete="name" maxLength={100} />
        </label>
        <label>
          <span>Your email</span>
          <input name="email" type="email" required autoComplete="email" maxLength={200} />
        </label>
        <label>
          <span>Interested in</span>
          <select name="topic" value={choice} onChange={(e) => setChoice(e.target.value)}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <span>
            Product link <small>(optional)</small>
          </span>
          <input name="link" type="url" placeholder="https://" maxLength={300} />
        </label>
        <label className="enquiry-wide">
          <span>What do you need help with?</span>
          <textarea
            name="message"
            required
            rows={4}
            maxLength={3000}
            placeholder={
              choice === CALL_TOPIC
                ? 'A few lines about your product, and some times that suit you (with your time zone).'
                : 'A few lines about your product and what you would like done.'
            }
          />
        </label>
        {/* Spam trap: hidden from people, filled in by bots. FormSubmit drops those. */}
        <input name="_honey" className="enquiry-honey" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="enquiry-actions">
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="enquiry-direct" role={status === 'error' ? 'alert' : undefined}>
          {status === 'error' ? (
            <>
              <strong>That didn't send.</strong> Please email me instead: {direct}
            </>
          ) : (
            <>Prefer email? {direct}</>
          )}
        </p>
      </div>
    </form>
  )
}
