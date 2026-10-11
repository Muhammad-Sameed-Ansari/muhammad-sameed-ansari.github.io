import { AnimatePresence } from 'motion/react'
import { Suspense, lazy } from 'react'
import { useStore } from '../store/useStore'
import type { PanelId } from '../store/useStore'
import './panels.css'

// Each panel is its own chunk, fetched the first time it is opened.
const PANELS: Record<PanelId, ReturnType<typeof lazy>> = {
  projects: lazy(() => import('./ProjectsOS')),
  skills: lazy(() => import('./SkillsPanel')),
  experience: lazy(() => import('./ExperiencePanel')),
  about: lazy(() => import('./AboutPanel')),
  contact: lazy(() => import('./ContactPanel')),
  hire: lazy(() => import('./HirePanel')),
}

export function Panels() {
  const panel = useStore((s) => s.panel)
  const Panel = panel ? PANELS[panel] : null
  return (
    <AnimatePresence>
      {Panel && (
        <Suspense key={panel} fallback={null}>
          <Panel />
        </Suspense>
      )}
    </AnimatePresence>
  )
}
