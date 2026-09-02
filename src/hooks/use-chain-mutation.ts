import { useMutation } from '@tanstack/react-query'
import { useLayoutEffect, useRef } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { makeWriteSession, type WriteSession } from '~/web3/wallet/require-write-session'
import type { WritePath } from '~/web3/wallet/write-path'

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
 * 链上写 mutation
 *
 * `retry: false`。每笔 `writeContractViaWallet` 自己 send 再 wait；忙闲只看 `isPending`。
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

  const mutation = useMutation({
    retry: false,
    mutationFn: async (vars: TVars): Promise<TValue> => {
      const session = makeWriteSession(walletRef.current)
      return args.mutation(vars, session)
    },
    onSuccess: (value, vars) => {
      try {
        const result = args.onSuccess?.(value, vars)
        if (result != null && typeof (result as PromiseLike<void>).then === 'function') {
          void Promise.resolve(result).catch((error: unknown) => {
            presentUserFacingError(error, t, { ctx: { path, walletAddress: address } })
          })
        }
      } catch (error) {
        presentUserFacingError(error, t, { ctx: { path, walletAddress: address } })
      }
    },
    onError: (error, vars) => {
      if (args.onError?.(error, vars) === 'handled') return
      presentUserFacingError(error, t, { ctx: { path, walletAddress: address } })
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
  }
}
