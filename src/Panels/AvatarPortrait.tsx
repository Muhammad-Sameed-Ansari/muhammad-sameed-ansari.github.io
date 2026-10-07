import type { AvatarConfig } from '../content/types'

const INK = '#2d2541'

/** Flat SVG portrait drawn from the same avatar config as the 3D character. */
export function AvatarPortrait({
  config,
  className,
  title,
}: {
  config: AvatarConfig
  className?: string
  title?: string
}) {
  const { skin, hairColor: hair, hairStyle } = config
  const stroke = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const }
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="100" cy="100" r="100" fill="#cfe9ff" />
      {/* Back hair for long styles */}
      {hairStyle === 'long' && (
        <path d="M40 92 Q36 168 62 176 L138 176 Q164 168 160 92 Z" fill={hair} {...stroke} />
      )}
      {/* Hoodie */}
      <path d="M30 210 Q32 150 100 146 Q168 150 170 210 Z" fill={config.hoodie} {...stroke} />
      <path d="M74 150 Q100 176 126 150" fill="none" stroke={INK} strokeWidth="4" />
      <line
        x1="92"
        y1="160"
        x2="90"
        y2="182"
        stroke="#fffaf0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="108"
        y1="160"
        x2="110"
        y2="182"
        stroke="#fffaf0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Ears and head */}
      <circle cx="40" cy="98" r="13" fill={skin} {...stroke} />
      <circle cx="160" cy="98" r="13" fill={skin} {...stroke} />
      <ellipse cx="100" cy="94" rx="62" ry="58" fill={skin} {...stroke} />
      {config.facialHair === 'beard' && (
        <path
          d="M46 104 Q52 152 100 152 Q148 152 154 104 Q140 128 100 130 Q60 128 46 104 Z"
          fill={hair}
          {...stroke}
        />
      )}
      {/* Hair */}
      {hairStyle === 'curly' ? (
        <g fill={hair} {...stroke}>
          {[46, 64, 84, 104, 124, 144, 156].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 48 : 60} r="20" />
          ))}
        </g>
      ) : hairStyle === 'spiky' ? (
        <path
          d="M40 86 L46 50 L62 60 L70 28 L88 50 L100 20 L112 50 L130 28 L138 60 L154 50 L160 86 Q100 62 40 86 Z"
          fill={hair}
          {...stroke}
        />
      ) : (
        <path
          d={
            hairStyle === 'buzz'
              ? 'M40 84 Q46 38 100 36 Q154 38 160 84 Q130 64 100 64 Q70 64 40 84 Z'
              : 'M38 92 Q36 30 100 30 Q164 30 162 92 Q150 66 128 62 Q118 74 92 72 Q70 70 62 62 Q46 70 38 92 Z'
          }
          fill={hair}
          {...stroke}
        />
      )}
      {hairStyle === 'bun' && <circle cx="100" cy="22" r="18" fill={hair} {...stroke} />}
      {/* Face */}
      <path d="M68 82 q10 -6 20 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path
        d="M112 82 q10 -6 20 0"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="78" cy="100" rx="7" ry="9" fill={config.eyeColor} />
      <ellipse cx="122" cy="100" rx="7" ry="9" fill={config.eyeColor} />
      <circle cx="81" cy="96" r="2.5" fill="#fff" />
      <circle cx="125" cy="96" r="2.5" fill="#fff" />
      {config.glasses && (
        <g fill="none" stroke={config.glassesColor} strokeWidth="5">
          <circle cx="78" cy="100" r="17" />
          <circle cx="122" cy="100" r="17" />
          <path d="M95 99 q5 -4 10 0" />
        </g>
      )}
      <ellipse cx="62" cy="120" rx="9" ry="5" fill="#ff9fa8" />
      <ellipse cx="138" cy="120" rx="9" ry="5" fill="#ff9fa8" />
      {config.facialHair === 'mustache' && (
        <path
          d="M84 122 Q100 112 116 122 Q100 120 84 122 Z"
          fill={hair}
          {...stroke}
          strokeWidth={3}
        />
      )}
      <path
        d="M88 126 Q100 138 112 126"
        fill="none"
        stroke={INK}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {config.headphones && (
        <g {...stroke}>
          <path d="M36 92 Q36 22 100 22 Q164 22 164 92" fill="none" stroke={INK} strokeWidth="9" />
          <rect x="24" y="80" width="22" height="36" rx="10" fill="#ff8a80" />
          <rect x="154" y="80" width="22" height="36" rx="10" fill="#ff8a80" />
        </g>
      )}
    </svg>
  )
}
