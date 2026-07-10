import { useEffect, useRef } from 'react'
import type { QueryObserverResult } from '@tanstack/react-query'

function useVisibilityAwareInterval(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled: boolean,
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled || intervalMs <= 0) {
      return
    }

    const tick = () => {
      if (document.visibilityState !== 'visible') {
        return
      }

      void callbackRef.current()
    }

    const timer = window.setInterval(tick, intervalMs)

    return () => {
      window.clearInterval(timer)
    }
  }, [enabled, intervalMs])
}

export function useVisibleQueryInterval<T>(
  query: Pick<QueryObserverResult<T>, 'refetch'>,
  intervalMs: number,
  enabled: boolean,
) {
  useVisibilityAwareInterval(
    () => {
      void query.refetch()
    },
    intervalMs,
    enabled,
  )
}
