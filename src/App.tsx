import { Suspense, lazy } from 'react'
import { useStore } from './store/useStore'

const RoomApp = lazy(() => import('./RoomApp'))

export function App() {
  const entered = useStore((s) => s.entered)
  const progress = useStore((s) => s.progress)
  return (
    <>
      <Suspense fallback={null}>
        <RoomApp />
      </Suspense>
      {!entered && (
        <button
          style={{ position: 'fixed', top: 20, left: 20, zIndex: 100 }}
          disabled={progress < 1}
          onClick={() => useStore.getState().enter()}
        >
          Enter ({Math.round(progress * 100)}%)
        </button>
      )}
    </>
  )
}
