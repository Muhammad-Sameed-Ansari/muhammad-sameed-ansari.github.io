import { useCallback, type ReactNode } from 'react'
import { getAnchor } from '../scene/anchors'

/** A DOM element pinned to a 3D anchor. Children are positioned bottom-center on the point. */
export function WorldAnchor({ id, children }: { id: string; children: ReactNode }) {
  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      getAnchor(id).el = el
    },
    [id],
  )
  return (
    <div ref={ref} className="world-anchor">
      <div className="world-anchor-inner">{children}</div>
    </div>
  )
}
