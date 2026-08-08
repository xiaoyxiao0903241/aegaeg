import { useRef } from 'react'

import { useChainMutation } from '~/hooks/use-chain-mutation'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

export type ExchangeSubmitOutcome = { ok: true } | { ok: false; error: unknown | null }

/**
 * 兑换写链的统一提交封装
 *
 * 包装 useChainMutation，统一提交中标志、提交结果引用与
 * 未知结果锁定，供各兑换模式复用。
 *
 * @param onClearAmount 提交成功后清空金额草稿的回调
 */
export function useExchangeWriteMutation(onClearAmount: () => void) {
  const submitOutcomeRef = useRef<ExchangeSubmitOutcome>({ ok: false, error: null })

  const chainWrite = useChainMutation({
    path: WRITE_PATH.EXCHANGE,
    mutation: async (run: (session: WriteSession) => Promise<void>, session) => {
      // 重置放在 owner hook 内，避免调用方改写返回的 ref（React Compiler）
      submitOutcomeRef.current = { ok: false, error: null }
      await run(session)
    },
    onSuccess: () => {
      onClearAmount()
      submitOutcomeRef.current = { ok: true }
    },
    onError: (err) => {
      // 未知结果会锁定写路径，从而置位 isLocked / blockResubmit
      submitOutcomeRef.current = { ok: false, error: err }
    },
  })

  return {
    chainWrite,
    submitOutcomeRef,
    isSubmitting: chainWrite.isPending,
    blockResubmit: chainWrite.isLocked,
  }
}
