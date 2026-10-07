/**
 * Per-frame values shared between scene components. They live outside React state
 * because they change every frame and nothing in the DOM needs to re-render for them.
 */

/** Smoothed 0..1 blends driven by the store's night/lamp flags. */
export const env = { night: 0, lamp: 0 }

/** Camera orbit controlled by drag (yaw) and wheel/pinch (zoom). */
export const view = { yaw: 0, zoom: 1 }

/** Destination ring shown after click-to-move. */
export const marker = { x: 0, z: 0, active: false, born: 0 }

export const now = () => performance.now() / 1000
