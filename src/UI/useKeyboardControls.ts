import { useEffect } from 'react'
import { interactNearest } from '../Character/commands'
import { char } from '../Character/runtime'
import { useStore } from '../store/useStore'

const KEYS: Record<string, [number, number]> = {
  KeyW: [0, 1],
  ArrowUp: [0, 1],
  KeyS: [0, -1],
  ArrowDown: [0, -1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
}

/** True when the keyboard is busy with a form field or a focused button/link. */
function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el || el === document.body) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

/** WASD / arrows to walk, E or Enter to use the nearest object. Esc is handled by panels. */
export function useKeyboardControls() {
  useEffect(() => {
    const held = new Set<string>()
    const update = () => {
      let x = 0
      let y = 0
      for (const code of held) {
        x += KEYS[code][0]
        y += KEYS[code][1]
      }
      char.keys.x = Math.sign(x)
      char.keys.y = Math.sign(y)
    }

    const onDown = (e: KeyboardEvent) => {
      const { entered, panel, helpOpen } = useStore.getState()
      if (!entered || panel || helpOpen || isTyping(e.target) || e.metaKey || e.ctrlKey) return
      if (KEYS[e.code]) {
        e.preventDefault()
        held.add(e.code)
        update()
      } else if (e.code === 'KeyE' || (e.code === 'Enter' && e.target === document.body)) {
        e.preventDefault()
        interactNearest()
      }
    }
    const onUp = (e: KeyboardEvent) => {
      if (held.delete(e.code)) update()
    }
    const clear = () => {
      held.clear()
      update()
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clear)
    const unsubscribe = useStore.subscribe((s, prev) => {
      if (s.panel && !prev.panel) clear()
    })
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clear)
      unsubscribe()
    }
  }, [])
}
