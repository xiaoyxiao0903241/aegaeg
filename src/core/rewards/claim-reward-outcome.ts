/** 领奖写交易的执行结果（含确认是否出错）。 */
export type ClaimRewardExecuteResult = {
  confirmError?: unknown
  confirmResult: unknown
  txHash: string
}

/**
 * 领奖结果的 UI 状态与缓存失效决定。
 *
 * shouldInvalidate=false 表示确认失败后不得清除余额（资金路径不变量）。
 */
export type ClaimRewardOutcome = {
  status: 'success' | 'confirm_failed'
  /** 资金路径不变量：链上成功但确认失败时为 false（不得乐观清空余额）。 */
  shouldInvalidate: boolean
  confirmResult: unknown
  txHash: string
}

/**
 * 领奖执行结果映射为 UI 状态与是否失效缓存。
 *
 * 确认失败（confirm_failed）绝不失效缓存，避免乐观清空余额。
 *
 * @param result 写交易执行结果
 * @returns 领奖结果
 * @see 手册 §9.5 签名奖励
 */
export function claimRewardOutcome(result: ClaimRewardExecuteResult): ClaimRewardOutcome {
  if (result.confirmError) {
    return {
      status: 'confirm_failed',
      shouldInvalidate: false,
      confirmResult: null,
      txHash: result.txHash,
    }
  }
  return {
    status: 'success',
    shouldInvalidate: true,
    confirmResult: result.confirmResult,
    txHash: result.txHash,
  }
}
