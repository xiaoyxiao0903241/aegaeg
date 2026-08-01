import { useMutation } from '@tanstack/react-query'
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
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

/** 已闩锁：静默；CTA 看 `isLocked`。 */
class ChainMutationLockedError extends Error {
  constructor() {
    super('WRITE_PATH_LOCKED')
    this.name = 'ChainMutationLockedError'
  }
}

/** 同 path 仍在飞：须 toast，禁与闩锁同形静默。 */
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
  /** 域写；软阻断抛错。信封构造 WriteSession 并传入。 */
  mutation: (vars: TVars, session: WriteSession) => Promise<TValue>
  onSuccess?: (value: TValue, vars: TVars) => void | Promise<void>
  /**
   * 仅额外副作用；默认错误 toast 在其后，除非返回 `'handled'`。
   */
  onError?: (error: unknown, vars: TVars) => void | 'handled'
}

/**
 * 链上写 mutation：unknown 信封 + WriteSession + `retry: false`。
 * 已闩锁静默；在飞 toast；其余走 onError 再 toast。
 * `isLocked` ≡ busy（闩锁∨在飞）；`isLatched` ≡ 仅 unknown 闩锁。
 */
export function useChainMutation<TVars = void, TValue = void>(
  args: UseChainMutationArgs<TVars, TValue>,
) {
  const { messages: t } = useI18n()
  const path = args.path
  const wallet = useActiveWallet()
  // mutationFn 异步跨渲染；layout 同步最新钱包，禁 render 期写 ref。
  const walletRef = useRef(wallet)
  useLayoutEffect(() => {
    walletRef.current = wallet
  }, [wallet])

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
      // onSuccess 失败不得让 mutateAsync 变成写失败。
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
     * 成功解析为 mutation 返回值；失败（含静默闩锁）在 onError 处理后为 `undefined`。
     * 副作用用 onSuccess；void 写成功也可能是 `undefined`，禁把 undefined 当失败。
     */
    mutate: async (vars?: TVars): Promise<TValue | undefined> => {
      try {
        return await mutation.mutateAsync(vars as TVars)
      } catch {
        // 错误已在 onError 处理（闩锁静默）。
        return undefined
      }
    },
    isPending: mutation.isPending,
    /** busy：闩锁∨在飞；CTA / canClaim 须阻断。 */
    isLocked,
    /** 仅 unknown 闩锁（在飞结束后仍可能为 true）。 */
    isLatched,
    clearLock: () => clearUnknownReceiptLock(path),
    reset: mutation.reset,
  }
}
