import type { Group, Mesh } from 'three'

/** Scene nodes the animation controller drives every frame. */
export interface AvatarRig {
  body: Group | null
  torso: Group | null
  head: Group | null
  eyes: Group | null
  armL: Group | null
  armR: Group | null
  legL: Group | null
  legR: Group | null
  phone: Mesh | null
  mug: Group | null
}

export const emptyRig = (): AvatarRig => ({
  body: null,
  torso: null,
  head: null,
  eyes: null,
  armL: null,
  armR: null,
  legL: null,
  legR: null,
  phone: null,
  mug: null,
})
