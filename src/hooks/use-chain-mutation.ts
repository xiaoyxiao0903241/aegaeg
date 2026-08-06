import { useMutation } from '@tanstack/react-query'
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { makeWriteSession, type WriteSession } from '~/web3/wallet/require-write-session'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import {
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  isWritePathBusy,
  subscribeWritePathBusy,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'

/** 写入路径被未知回执锁定：此时静默处理，按钮状态看 `isLocked`。 */
class ChainMutationLockedError extends Error {
  constructor() {
    super('WRITE_PATH_LOCKED')
    this.name = 'ChainMutationLockedError'
  }
}

/** 同一写入路径仍有请求在途：必须弹提示，不能像锁定那样静默。 */
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
  /** 实际链上写函数；调用前由内部构造 WriteSession 并传入。 */
  mutation: (vars: TVars, session: WriteSession) => Promise<TValue>
  onSuccess?: (value: TValue, vars: TVars) => void | Promise<void>
  /**
   * 仅承担额外副作用；默认错误 toast 在其后弹出，除非返回 `'handled'`。
   */
  onError?: (error: unknown, vars: TVars) => void | 'handled'
}

/**
 * 链上写操作 mutation
 *
 * 通过未知回执互斥保护同一写入路径：回执状态未知期间再次写入会抛锁定错误，
 * 由本 hook 静默处理；路径上已有请求在途时提示用户等待。
 * `isLocked` 表示「锁定或在途」；`isLatched` 仅表示处于未知回执锁定。
 */
export function useChainMutation<TVars = void, TValue = void>(
  args: UseChainMutationArgs<TVars, TValue>,
) {
  const { messages: t } = useI18n()
  const path = args.path
  const wallet = useActiveWallet()
  const account = useActiveAccount()
  const address = account?.address
  const walletRef = useRef(wallet)
  useLayoutEffect(() => {
    walletRef.current = wallet
  }, [wallet])

  const isLocked = useSyncExternalStore(
    subscribeWritePathBusy,
    () => isWritePathBusy(path, address),
    () => isWritePathBusy(path, address),
  )
  const isLatched = useSyncExternalStore(
    subscribeWritePathBusy,
    () => isUnknownReceiptLocked(path, address),
    () => isUnknownReceiptLocked(path, address),
  )

  const mutation = useMutation({
    retry: false,
    mutationFn: async (vars: TVars): Promise<TValue> => {
      const session = makeWriteSession(walletRef.current)
      const guarded = await submitWithUnknownReceiptLock({
        path,
        address: session.address,
        whenLocked: new ChainMutationLockedError(),
        whenInFlight: new ChainMutationInFlightError(),
        run: () => args.mutation(vars, session),
      })
      if (!guarded.ok) throw guarded.error
      return guarded.value as TValue
    },
    onSuccess: (value, vars) => {
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
    mutate: async (vars?: TVars): Promise<TValue | undefined> => {
      try {
        return await mutation.mutateAsync(vars as TVars)
      } catch {
        return undefined
      }
    },
    isPending: mutation.isPending,
    isLocked,
    isLatched,
    clearLock: () => clearUnknownReceiptLock(path, address),
    reset: mutation.reset,
  }
}
