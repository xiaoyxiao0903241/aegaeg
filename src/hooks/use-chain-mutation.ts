import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { useActiveWallet } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import {
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'
import { bindWriteSessionWallet } from '~/web3/wallet/require-write-session'

/** Path already latched — no toast (CTA uses `isLocked`). */
class ChainMutationLockedError extends Error {
  constructor() {
    super('WRITE_PATH_LOCKED')
    this.name = 'ChainMutationLockedError'
  }
}

function isChainMutationLockedError(error: unknown): boolean {
  return error instanceof ChainMutationLockedError
}

export type UseChainMutationArgs<TVars, TValue> = {
  path: WritePath
  /** Domain write — soft gates throw. Envelope applies lock + write-session bind. */
  mutation: (vars: TVars) => Promise<TValue>
  onSuccess?: (value: TValue, vars: TVars) => void | Promise<void>
  /**
   * Extra side effects only — default error toast runs after unless `'handled'`
   * (rare: action toasts that replace the default message).
   */
  onError?: (error: unknown, vars: TVars) => void | 'handled'
}

/**
 * Shared chain-write mutation: unknown-receipt envelope + write-session bind +
 * `retry: false` + isPending.
 * Already-latched → silent no-op. Real errors → onError side effects, then getErrorMessage toast.
 *
 * While `mutation` runs, `requireWriteSession()` resolves the active wallet (no call-site pass).
 */
export function useChainMutation<TVars = void, TValue = void>(
  args: UseChainMutationArgs<TVars, TValue>,
) {
  const { messages: t } = useI18n()
  const path = args.path
  const wallet = useActiveWallet()
  const walletRef = useRef(wallet)
  walletRef.current = wallet

  const mutation = useMutation({
    retry: false,
    mutationFn: async (vars: TVars): Promise<TValue> => {
      const unbind = bindWriteSessionWallet(() => walletRef.current)
      try {
        const guarded = await submitWithUnknownReceiptLock({
          path,
          whenLocked: new ChainMutationLockedError(),
          run: () => args.mutation(vars),
        })
        if (!guarded.ok) throw guarded.error
        return guarded.value as TValue
      } finally {
        unbind()
      }
    },
    onSuccess: (value, vars) => args.onSuccess?.(value, vars),
    onError: (error, vars) => {
      if (isChainMutationLockedError(error)) return
      if (args.onError?.(error, vars) === 'handled') return
      presentUserFacingError(error, t)
    },
  })

  return {
    mutate: async (vars?: TVars): Promise<TValue | undefined> => {
      try {
        return await mutation.mutateAsync(vars as TVars)
      } catch {
        // presented in onError (or silent lock via ChainMutationLockedError)
        return undefined
      }
    },
    isPending: mutation.isPending,
    isLocked: isUnknownReceiptLocked(path),
    clearLock: () => clearUnknownReceiptLock(path),
    reset: mutation.reset,
  }
}
