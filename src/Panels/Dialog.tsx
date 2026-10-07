import { motion, type TargetAndTransition } from 'motion/react'
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { closeSection } from '../Character/commands'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select, [tabindex]:not([tabindex="-1"])'

interface DialogProps {
  labelledBy: string
  className: string
  children: ReactNode
  enter?: TargetAndTransition
  /** Called on Escape instead of closing, e.g. to close an inner window first. */
  onEscape?: () => boolean
}

/**
 * Modal shell shared by every panel: backdrop, focus moved in and trapped, Escape and
 * backdrop click close it, and focus returns to where it was afterwards.
 */
export function Dialog({ labelledBy, className, children, enter, onEscape }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus({ preventScroll: true })
    return () => {
      if (previous && previous !== document.body && previous.isConnected) previous.focus()
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      if (!onEscape?.()) closeSection()
      return
    }
    if (e.key !== 'Tab' || !ref.current) return
    const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null,
    )
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (
      e.shiftKey &&
      (document.activeElement === first || document.activeElement === ref.current)
    ) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <motion.div
      className="panel-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && closeSection()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={className}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 40, scale: 0.92, rotate: -3 }}
        animate={enter ?? { opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Comic-style card panel with a title bar and a close button. */
export function PanelShell({
  id,
  title,
  variant,
  children,
}: {
  id: string
  title: string
  variant: string
  children: ReactNode
}) {
  return (
    <Dialog labelledBy={`${id}-title`} className={`panel panel-${variant}`}>
      <header className="panel-head">
        <h2 id={`${id}-title`}>{title}</h2>
        <button
          className="icon-btn panel-close"
          aria-label="Close and go back to the room"
          onClick={closeSection}
        >
          ✕
        </button>
      </header>
      <div className="panel-body">{children}</div>
    </Dialog>
  )
}
