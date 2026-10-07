import { AnimatePresence, MotionConfig } from 'motion/react'
import { Suspense, lazy, useEffect } from 'react'
import { useStore } from './store/useStore'
import { Loader } from './UI/Loader'

const RoomApp = lazy(() => import('./RoomApp'))
const ClassicView = lazy(() => import('./classic/ClassicView'))

export function App() {
  const mode = useStore((s) => s.mode)
  const entered = useStore((s) => s.entered)

  // Keep the back button working when switching between the room and classic view.
  useEffect(() => {
    const onPop = () => {
      const classic = new URLSearchParams(window.location.search).get('view') === 'classic'
      useStore.setState({ mode: classic ? 'classic' : 'room', panel: null, focus: null })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {mode === 'classic' ? (
        <Suspense fallback={null}>
          <ClassicView />
        </Suspense>
      ) : (
        <>
          <Suspense fallback={null}>
            <RoomApp />
          </Suspense>
          <AnimatePresence>{!entered && <Loader key="loader" />}</AnimatePresence>
        </>
      )}
    </MotionConfig>
  )
}
