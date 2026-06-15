import type { QueryObserverResult } from '@tanstack/react-query'
import { useVisibilityAwareInterval } from '../use-visibility-aware-interval'

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
