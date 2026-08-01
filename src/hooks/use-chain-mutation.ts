import { useMutation } from '@tanstack/react-query'
import { useRef, useSyncExternalStore } from 'react'
import { useActiveWallet } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import {
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  isWritePathBusy,
  subscribeWritePathBusy,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'
import { makeWriteSession, type WriteSession } from '~/web3/wallet/require-write-session'
import { WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'

/** Path already latched — no toast (CTA uses `isLocked`). */
class ChainMutationLockedError extends Error {
  constructor() {
    super('WRITE_PATH_LOCKED')
    this.name = 'ChainMutationLockedError'
  }
}

/** Sibling write still in flight — toast (not silent). */
class ChainMutationInFlightError extends Error {
  constructor() {
    super(WALLET_WRITE_ERROR.IN_FLIGHT)
    this.name = 'ChainMutationInFlightError'
  }
}

function isChainMutationLockedError(error: unknown): boolean {
  return error instanceof ChainMutationLockedError
}

export type UseChainMutationArgs<TVars, TValue> = {
  path: WritePath
  /** Domain write — soft gates throw. Envelope builds WriteSession and passes it in. */
  mutation: (vars: TVars, session: WriteSession) => Promise<TValue>
  onSuccess?: (value: TValue, vars: TVars) => void | Promise<void>
  /**
   * Extra side effects only — default error toast runs after unless `'handled'`
   * (rare: action toasts that replace the default message).
   */
  onError?: (error: unknown, vars: TVars) => void | 'handled'
}

/**
 * Shared chain-write mutation: unknown-receipt envelope + explicit WriteSession +
 * `retry: false` + isPending.
 * Already-latched → silent no-op. In-flight sibling → toast. Real errors → onError, then toast.
 *
 * `isLocked` ≡ path busy (unknown latch ∨ in-flight) — historical name; not latch-only.
 * `isLatched` ≡ unknown-outcome latch only.
 */
export function useChainMutation<TVars = void, TValue = void>(
  args: UseChainMutationArgs<TVars, TValue>,
) {
  const { messages: t } = useI18n()
  const path = args.path
  const wallet = useActiveWallet()
  const walletRef = useRef(wallet)
  walletRef.current = wallet

  const isLocked = useSyncExternalStore(
    subscribeWritePathBusy,
    () => isWritePathBusy(path),
    () => isWritePathBusy(path),
  )
  const isLatched = useSyncExternalStore(
    subscribeWritePathBusy,
    () => isUnknownReceiptLocked(path),
    () => isUnknownReceiptLocked(path),
  )

  const mutation = useMutation({
    retry: false,
    mutationFn: async (vars: TVars): Promise<TValue> => {
      const session = makeWriteSession(walletRef.current)
      const guarded = await submitWithUnknownReceiptLock({
        path,
        whenLocked: new ChainMutationLockedError(),
        whenInFlight: new ChainMutationInFlightError(),
        run: () => args.mutation(vars, session),
      })
      if (!guarded.ok) throw guarded.error
      return guarded.value as TValue
    },
    onSuccess: (value, vars) => {
      // Isolate side-effect failures from write success — do not reject mutateAsync.
      try {
        const result = args.onSuccess?.(value, vars)
        if (result != null && typeof (result as PromiseLike<void>).then === 'function') {
          void Promise.resolve(result).catch((error: unknown) => {
            presentUserFacingError(error, t)
          })
        }
      } catch (error) {
        presentUserFacingError(error, t)
      }
    },
    onError: (error, vars) => {
      if (isChainMutationLockedError(error)) return
      if (args.onError?.(error, vars) === 'handled') return
      presentUserFacingError(error, t)
    },
  })

  return {
    /**
     * Runs the write. Resolves with the mutation value on success.
     * On failure (including silent latch): resolves `undefined` after onError handling.
     * Prefer `onSuccess` for side effects — do not treat a void mutation's `undefined` as failure.
     */
    mutate: async (vars?: TVars): Promise<TValue | undefined> => {
      try {
        return await mutation.mutateAsync(vars as TVars)
      } catch (error) {
        // mutationFn / lock errors already handled in onError (or silent lock).
        if (isChainMutationLockedError(error)) return undefined
        return undefined
      }
    },
    isPending: mutation.isPending,
    /** Path busy: unknown latch ∨ in-flight. CTA / canClaim should treat as blocked. */
    isLocked,
    /** Unknown-outcome latch only (survives after in-flight ends). */
    isLatched,
    clearLock: () => clearUnknownReceiptLock(path),
    reset: mutation.reset,
  }
}
