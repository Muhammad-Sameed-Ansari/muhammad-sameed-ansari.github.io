import type { Social } from '../content/types'

/** Simple hand-drawn style glyphs (not brand logos) for social links. */
export function SocialIcon({ icon }: { icon: Social['icon'] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (icon) {
    case 'github':
      return (
        <svg {...common}>
          <path d="M8 8 4 12l4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
        </svg>
      )
    case 'email':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M5 4l14 16M19 4 5 20" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="4" />
          <path d="m10 9.5 4.5 2.5-4.5 2.5z" />
        </svg>
      )
    case 'dribbble':
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </svg>
      )
  }
}
