import { Vector3 } from 'three'

/**
 * Lightweight replacement for drei's <Html>: DOM elements (speech bubble, proximity
 * labels) live in a normal overlay layer, and <AnchorProjector /> moves them every frame
 * to follow a point in the 3D scene. No extra React roots, normal z-index stacking.
 */

interface Anchor {
  pos: Vector3
  el: HTMLElement | null
}

export const anchors = new Map<string, Anchor>()

export function getAnchor(id: string) {
  let a = anchors.get(id)
  if (!a) {
    a = { pos: new Vector3(), el: null }
    anchors.set(id, a)
  }
  return a
}
