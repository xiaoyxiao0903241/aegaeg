import { useChainMutation } from '~/hooks/use-chain-mutation'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { WRITE_PATH } from '~/web3/wallet/write-path'

/**
 * 兑换写链提交
 *
 * 包装 `useChainMutation`：成功后清空金额草稿。`mutate` 成功返回 `true`。
 *
 * @param onClearAmount 提交成功后清空金额草稿的回调
 */
export function useExchangeWriteMutation(onClearAmount: () => void) {
  const chainWrite = useChainMutation({
    path: WRITE_PATH.EXCHANGE,
    mutation: async (run: (session: WriteSession) => Promise<void>, session) => {
      await run(session)
      return true as const
    },
    onSuccess: onClearAmount,
  })

  return {
    chainWrite,
    isSubmitting: chainWrite.isPending,
  }
}
