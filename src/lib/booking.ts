/**
 * Opens the "Book a call" scheduler. A cal.com link opens Cal.com's own booking popup over
 * the page (their script loads only on first use); any other link opens in a new tab.
 */

type CalApi = ((...args: unknown[]) => void) & {
  q?: unknown[][]
  ns?: Record<string, unknown>
  loaded?: boolean
}

declare global {
  interface Window {
    Cal?: CalApi
  }
}

const CAL_SCRIPT = 'https://app.cal.com/embed/embed.js'

/** Cal.com's documented loader: queue calls until embed.js arrives and replays them. */
function cal(): CalApi {
  if (!window.Cal) {
    const api: CalApi = (...args) => {
      api.q!.push(args)
    }
    // embed.js reads these when it takes over the queue.
    api.q = []
    api.ns = {}
    api.loaded = true
    window.Cal = api
    const script = document.createElement('script')
    script.src = CAL_SCRIPT
    script.async = true
    document.head.appendChild(script)
    api('init', { origin: 'https://cal.com' })
    api('ui', { theme: 'light', styles: { branding: { brandColor: '#2d2541' } } })
  }
  return window.Cal
}

/** "your-name/15min" from "https://cal.com/your-name/15min", or null for other services. */
export function calLink(url: string) {
  try {
    const u = new URL(url)
    return u.hostname === 'cal.com' || u.hostname.endsWith('.cal.com')
      ? u.pathname.replace(/^\/+|\/+$/g, '')
      : null
  } catch {
    return null
  }
}

const preloaded = new Set<string>()

/** Warm up the popup on hover or focus, so the calendar is ready by the time it opens. */
export function preloadBooking(url: string) {
  const link = calLink(url)
  if (link && !preloaded.has(link)) {
    preloaded.add(link)
    cal()('preload', { calLink: link })
  }
}

export function openBooking(url: string) {
  const link = calLink(url)
  if (!link) {
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }
  cal()('modal', { calLink: link, config: { layout: 'month_view' } })
}
