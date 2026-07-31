import { useEffect, useEffectEvent } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { presentUserFacingError } from '~/web3/present-user-facing-error'

/**
 * Toast when `error` becomes truthy (quote / page query / bind — not chain writes).
 * Chain writes use `useChainMutation` instead.
 * Default message: `getErrorMessage`. Pass `resolveMessage` only for API/page overrides.
 */
export function usePresentUserFacingError(
  error: unknown,
  options?: {
    id?: string
    trigger?: unknown
    onPresented?: () => void
    resolveMessage?: (error: unknown) => string | null | undefined
  },
): void {
  const { messages: t } = useI18n()
  const present = useEffectEvent((next: unknown) => {
    presentUserFacingError(next, t, {
      id: options?.id,
      resolveMessage: options?.resolveMessage,
    })
    options?.onPresented?.()
  })

  useEffect(() => {
    if (!error) return
    present(error)
  }, [error, options?.trigger])
}
