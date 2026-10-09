import { useState } from 'react'
import { asset } from '../lib/asset'
import './DeviceFrame.css'

interface DeviceFrameProps {
  variant: 'phone' | 'tablet'
  /** Paths under /public. With none, the screen shows the app's launch screen instead. */
  shots?: string[]
  title: string
  /** Emoji shown in the launch screen's app-icon tile. */
  icon: string
  /** Launch screen background. */
  color: string
  /** Small line under the title on the launch screen, e.g. "iOS · Android". */
  caption?: string
  /** Hide the whole frame from screen readers, e.g. when it is only a thumbnail. */
  decorative?: boolean
  className?: string
}

/**
 * A screenshot inside a pure CSS phone or tablet. The frame fills its parent's width, so the
 * parent sets the size. Everything inside scales with it.
 */
export function DeviceFrame({
  variant,
  shots = [],
  title,
  icon,
  color,
  caption,
  decorative = false,
  className,
}: DeviceFrameProps) {
  const [shot, setShot] = useState(0)
  const count = shots.length
  const i = count ? shot % count : 0
  const phone = variant === 'phone'
  return (
    <div
      className={`device device-${variant}${className ? ` ${className}` : ''}`}
      aria-hidden={decorative || undefined}
    >
      <div className="device-body">
        <div className="device-screen">
          {count > 0 ? (
            <img
              src={asset(shots[i])}
              alt={decorative ? '' : `${title}, screenshot ${i + 1} of ${count}`}
              loading="lazy"
              width={phone ? 390 : 1024}
              height={phone ? 845 : 768}
            />
          ) : (
            <div className="device-splash" style={{ background: color }}>
              <span className="device-app-icon" aria-hidden="true">
                {icon}
              </span>
              <span className="device-app-name">{title}</span>
              {caption && <span className="device-app-caption">{caption}</span>}
            </div>
          )}
          {phone && <span className="device-island" aria-hidden="true" />}
          {phone && <span className="device-home" aria-hidden="true" />}
        </div>
        {!phone && <span className="device-camera" aria-hidden="true" />}
      </div>
      {count > 1 && !decorative && (
        <div className="device-nav">
          <button
            className="icon-btn"
            aria-label="Previous screenshot"
            onClick={() => setShot((i - 1 + count) % count)}
          >
            ‹
          </button>
          <span>
            {i + 1} / {count}
          </span>
          <button
            className="icon-btn"
            aria-label="Next screenshot"
            onClick={() => setShot((i + 1) % count)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
