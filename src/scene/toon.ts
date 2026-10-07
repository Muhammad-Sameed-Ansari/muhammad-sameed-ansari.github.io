import { DataTexture, NearestFilter, RedFormat } from 'three'

/** Outline color used everywhere (a soft ink instead of pure black). */
export const INK = '#2d2541'

/**
 * Three-step light ramp for MeshToonMaterial. The values lift the shadow side so the
 * palette stays pastel instead of muddy.
 */
function createGradientMap() {
  const tex = new DataTexture(new Uint8Array([120, 195, 255]), 3, 1, RedFormat)
  tex.minFilter = NearestFilter
  tex.magFilter = NearestFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  return tex
}

export const gradientMap = createGradientMap()
