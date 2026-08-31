/**
 * 释放队列 / 本金释放缓冲的写前校验（纯函数）。
 *
 * RewardQueue（释放）与 PrincipalReleaseVault（本金）共用可领额判定；
 * 调用方须在任意写操作后重新读取可领额。
 *
 * @see 手册 §12 RewardQueue 奖励释放队列
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */

import { BPS_DENOM } from '~/core/exchange/bps'

export type ReleaseClaimBlockReason = 'zeroAmount'

/**
 * 释放队列 / 本金释放领取的写前阻断。
 *
 * 可领额非正时提交必然失败。
 *
 * @param args.claimable 可领取金额
 * @returns 阻断原因
 * @see 手册 §12.4 用户写方法
 */
export function releaseClaimBlockReason(args: {
  claimable: bigint
}): ReleaseClaimBlockReason | null {
  if (args.claimable <= 0n) return 'zeroAmount'
  return null
}

/**
 * 释放中 = 尚未线性释放的部分。
 *
 * remainingUnclaimed 为池内未领（队列 lockedAmount / 分流器 amount−claimed）。
 * 释放完成后 remainingUnclaimed === claimable，结果为 0。
 *
 * @param remainingUnclaimed 未领取剩余
 * @param claimable 已解锁可领
 */
export function unvestedRemaining(remainingUnclaimed: bigint, claimable: bigint): bigint {
  return remainingUnclaimed > claimable ? remainingUnclaimed - claimable : 0n
}

/**
 * 已释放进度（可领额占总量的万分比）。
 *
 * @param claimable 可领取金额
 * @param releasing 释放中金额
 * @returns 0–10000 的进度
 */
export function releaseProgressBps(claimable: bigint, releasing: bigint): number {
  const total = claimable + releasing
  if (total <= 0n) return 0
  return Number((claimable * BPS_DENOM) / total)
}
