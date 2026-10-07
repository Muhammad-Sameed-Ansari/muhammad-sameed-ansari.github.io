import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

/** Returns the current cat poke count while its "Meow!" bubble should be visible, else 0. */
export function useCatMeow() {
  const pokes = useStore((s) => s.pokes.cat)
  const [dismissed, setDismissed] = useState(0)
  useEffect(() => {
    if (!pokes) return
    const id = setTimeout(() => setDismissed(pokes), 1800)
    return () => clearTimeout(id)
  }, [pokes])
  return pokes !== dismissed ? pokes : 0
}
