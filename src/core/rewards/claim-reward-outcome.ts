/** 领奖写交易的执行结果。 */
export type ClaimRewardExecuteResult = {
  confirmResult: unknown
  txHash: string
}

/**
 * 领奖结果的 UI 状态与缓存失效决定。
 *
 * 调用方应先 await confirm，再映射本结果。confirm 成败不改变状态：一律成功并失效缓存。
 */
export type ClaimRewardOutcome = {
  status: 'success'
  shouldInvalidate: boolean
  confirmResult: unknown
  txHash: string
}

/**
 * 领奖执行结果映射为 UI 状态与是否失效缓存。
 *
 * 链上已成功则一律 success 并失效缓存。confirm 失败也刷新；再对不齐不是前端能修的。
 *
 * @param result 写交易执行结果（confirm 已尝试）
 * @returns 领奖结果
 * @see 手册 §9.5 签名奖励
 */
export function claimRewardOutcome(result: ClaimRewardExecuteResult): ClaimRewardOutcome {
  return {
    status: 'success',
    shouldInvalidate: true,
    confirmResult: result.confirmResult,
    txHash: result.txHash,
  }
}
