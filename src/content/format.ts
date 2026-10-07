import type { TimelineEntry } from './types'

/** Words for skill levels 1–5. */
export const LEVELS = ['', 'Learning', 'Familiar', 'Comfortable', 'Strong', 'Expert'] as const

export const dateRange = (e: TimelineEntry) => (e.end ? `${e.start} – ${e.end}` : e.start)
