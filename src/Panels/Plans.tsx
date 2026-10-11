import { useState } from 'react'
import { hire } from '../content/hire'
import { openBooking, preloadBooking } from '../lib/booking'
import { CALL_TOPIC, EnquiryForm } from './EnquiryForm'
import './plans.css'

/** Plan cards, notes, "Book a call" and the enquiry form. Shared by the "Hire me" panel and the classic view. */
export function Plans({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const { intro, plans, notes, bookingUrl } = hire
  const Heading = `h${headingLevel}` as const
  const featured = plans.find((p) => p.featured) ?? plans[0]
  // focusKey changes on every button press, so pressing the same plan twice still jumps to the form.
  const [enquiry, setEnquiry] = useState({ topic: featured.name, focusKey: 0 })
  const ask = (topic: string) => setEnquiry((e) => ({ topic, focusKey: e.focusKey + 1 }))

  return (
    <div className="plans">
      <p className="plans-intro">{intro}</p>
      <ul className="plan-list">
        {plans.map((plan) => (
          <li key={plan.name} className={`plan${plan.featured ? ' is-featured' : ''}`}>
            {plan.featured && <span className="plan-badge">Most popular</span>}
            <Heading className="plan-name">{plan.name}</Heading>
            <p className="plan-price">
              <strong>{plan.price}</strong>
              <span>{plan.cadence}</span>
            </p>
            <p className="plan-for">{plan.forWho}</p>
            <ul className="plan-includes">
              {plan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn${plan.featured ? ' btn-primary' : ''}`}
              onClick={() => ask(plan.name)}
            >
              Ask about {plan.name}
            </button>
          </li>
        ))}
      </ul>
      <ul className="plan-notes">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div className="plans-cta">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (bookingUrl ? openBooking(bookingUrl) : ask(CALL_TOPIC))}
          onPointerEnter={bookingUrl ? () => preloadBooking(bookingUrl) : undefined}
          onFocus={bookingUrl ? () => preloadBooking(bookingUrl) : undefined}
        >
          <span aria-hidden="true">📅</span> Book a free 15-min call
        </button>
        <p>
          Not sure which plan fits? Tell me about your product and I'll suggest one. Prices are in
          USD.
        </p>
      </div>
      <EnquiryForm topic={enquiry.topic} focusKey={enquiry.focusKey} />
    </div>
  )
}
