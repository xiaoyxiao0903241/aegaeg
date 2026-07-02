import { useEffect, useRef } from 'react'

export function useVisibilityAwareInterval(
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
