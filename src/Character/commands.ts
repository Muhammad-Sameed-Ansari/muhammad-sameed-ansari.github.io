import { portfolio } from '../content/portfolio'
import { sfx } from '../lib/sound'
import { findPath } from '../scene/nav'
import { OBJECTS, type EasterEgg, type ObjectId, type Section } from '../scene/objects'
import { marker, now } from '../scene/runtime'
import { useStore } from '../store/useStore'
import { char, type OneShot } from './runtime'

/**
 * Everything that can make the character do something: clicks, keys, quick-nav and
 * the HUD all go through these functions.
 */

const store = () => useStore.getState()

export function noteActivity() {
  char.lastActivity = now()
}

export function playOneShot(action: OneShot, seconds: number, after?: () => void) {
  char.oneShot = action
  char.oneShotUntil = now() + seconds
  char.afterOneShot = after ?? null
}

function standUp() {
  if (!char.sitting) return
  char.sitting = false
  const spot = OBJECTS.projects.interact!
  char.path = [{ x: spot.x, z: spot.z }]
}

export function walkTo(x: number, z: number, pending: ObjectId | null = null, showMarker = true) {
  noteActivity()
  store().markMoved()
  standUp()
  const path = findPath(char, { x, z })
  if (!path.length) return
  char.path = path
  char.pending = pending
  char.oneShot = null
  const end = path[path.length - 1]
  Object.assign(marker, { x: end.x, z: end.z, active: showMarker, born: now() })
}

/** Walks to an object's interaction point, then uses it. */
export function goToObject(id: ObjectId) {
  const obj = OBJECTS[id]
  const s = store()
  if (s.panel) closeSection()
  if (!obj.interact) {
    triggerEasterEgg(id as EasterEgg)
    return
  }
  const { x, z } = obj.interact
  if (Math.hypot(char.x - x, char.z - z) < 0.2 && !char.sitting) {
    arrive(id)
  } else {
    walkTo(x, z, id)
  }
}

/** Called by the controller when the character reaches an object's interaction point. */
export function arrive(id: ObjectId) {
  const obj = OBJECTS[id]
  if (obj.interact) char.targetHeading = obj.interact.heading
  if (id === 'projects') {
    sitAtDesk()
  } else if (obj.section) {
    const section = obj.section
    playOneShot('reach', 0.55, () => openSection(section))
  } else {
    playOneShot('reach', 0.5)
    triggerEasterEgg(id as EasterEgg)
  }
}

function sitAtDesk() {
  char.sitting = true
  char.path = []
  store().setFocus('projects')
  sfx.whoosh()
  setTimeout(() => {
    if (char.sitting && store().focus === 'projects') openSection('projects')
  }, 1100)
}

export function openSection(section: Section) {
  store().setFocus(section)
  store().openPanel(section)
  sfx.open()
}

export function closeSection() {
  if (!store().panel && !store().focus) return
  store().closePanel()
  standUp()
  sfx.close()
  noteActivity()
}

/** Jumps from quick-nav: walk over and open the section. */
export function navigateTo(id: ObjectId) {
  sfx.click()
  goToObject(id)
}

export function interactNearest() {
  const id = store().nearId
  if (id) goToObject(id)
}

export function wave(text?: string, ms?: number) {
  if (char.sitting) return
  noteActivity()
  playOneShot('wave', 2)
  sfx.pop()
  if (text) store().say(text, ms)
}

export function triggerEasterEgg(egg: EasterEgg) {
  const s = store()
  noteActivity()
  s.poke(egg)
  switch (egg) {
    case 'window':
      s.toggleNight()
      sfx.toggle()
      s.say(store().night ? 'Cozy night mode 🌙' : 'Good morning! ☀️')
      break
    case 'lamp':
      s.toggleLamp()
      sfx.toggle()
      break
    case 'mug':
      sfx.sip()
      if (!char.sitting && !char.path.length) playOneShot('sip', 2.2)
      s.say('Ahh, fresh coffee ☕')
      break
    case 'plant':
      sfx.boing()
      s.say('*wiggle wiggle* 🌱')
      break
    case 'cat':
      sfx.meow()
      s.say(`Hi ${portfolio.petName}! 🐾`)
      break
  }
}

const IDLE_QUIPS: { action: OneShot; text: string; seconds: number }[] = [
  { action: 'stretch', text: 'Mmmh… stretch break 🙆', seconds: 3 },
  { action: 'phone', text: 'Just checking my notifications 📱', seconds: 3.5 },
  { action: 'sip', text: '*sips coffee* ☕', seconds: 2.6 },
]

export function playIdleFun() {
  const pick = IDLE_QUIPS[Math.floor(Math.random() * IDLE_QUIPS.length)]
  playOneShot(pick.action, pick.seconds)
  store().say(pick.text, pick.seconds * 1000)
  noteActivity()
}
