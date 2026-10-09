import type { Platform, Project, StoreLink, TimelineEntry } from './types'

/** Words for skill levels 1–5. */
export const LEVELS = ['', 'Learning', 'Familiar', 'Comfortable', 'Strong', 'Expert'] as const

export const dateRange = (e: TimelineEntry) => (e.end ? `${e.start} – ${e.end}` : e.start)

export const storeLabel = (s: StoreLink) =>
  `${s.app ? `${s.app} on ` : ''}${s.store === 'app-store' ? 'App Store' : 'Google Play'}`

const PLATFORM_LABELS: Record<Platform, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  ipad: 'iPad',
}

export const platformLabel = (platform: Platform) => PLATFORM_LABELS[platform]

export const isWeb = (p: Project) => p.platforms.includes('web')

/** True for anything that runs on a phone or tablet. */
export const isMobile = (p: Project) => p.platforms.some((pl) => pl !== 'web')

export type ProjectView = 'web' | 'phone' | 'tablet'

/** Which device the mobile side of a project is shown in, from its first non-web platform. */
export const mobileView = (p: Project): 'phone' | 'tablet' =>
  p.platforms.find((pl) => pl !== 'web') === 'ipad' ? 'tablet' : 'phone'

/** The view a project opens in, worked out from its main (first) platform. */
export const primaryView = (p: Project): ProjectView =>
  p.platforms[0] === 'web' ? 'web' : mobileView(p)

export type ProjectFilter = 'all' | 'web' | 'mobile'

export const PROJECT_FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
]

/** Projects on both web and mobile match both filters. */
export const matchesFilter = (p: Project, f: ProjectFilter) =>
  f === 'all' || (f === 'web' ? isWeb(p) : isMobile(p))

/** "iOS · Android" style line for a project's mobile platforms. */
export const mobilePlatformsLine = (p: Project) =>
  p.platforms
    .filter((pl) => pl !== 'web')
    .map(platformLabel)
    .join(' · ')

/** Short result line for screen readers after the filter changes, e.g. "4 web projects". */
export const filterSummary = (f: ProjectFilter, count: number) =>
  `${f === 'all' ? 'All ' : ''}${count} ${f === 'all' ? '' : `${f} `}project${count === 1 ? '' : 's'}`
