import { useEffect, useEffectEvent } from 'react'
import { presentUserFacingError } from '~/web3/present-user-facing-error'

/**
 * Present `error` as a toast when it becomes truthy.
 * Pass `trigger` to re-fire when the same sentinel is set again (e.g. quote retry).
 */
export function usePresentUserFacingError(
  error: unknown,
  resolveMessage: (error: unknown) => string | null | undefined,
  options?: {
    id?: string
    trigger?: unknown
    onPresented?: () => void
  },
): void {
  const present = useEffectEvent((next: unknown) => {
    presentUserFacingError(next, resolveMessage, options?.id ? { id: options.id } : undefined)
    options?.onPresented?.()
  })

  useEffect(() => {
    if (!error) return
    present(error)
  }, [error, options?.trigger])
}
