/**
 * 释放队列 / 本金释放缓冲的写前校验（纯函数）。
 *
 * RewardQueue（释放）与 PrincipalReleaseVault（本金）共用同一套
 * 「可领 / 未知锁定」判定；调用方须在任意写操作后重新读取可领额。
 *
 * @see 手册 §12 RewardQueue 奖励释放队列
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */

import { BPS_DENOM } from '~/core/exchange/bps'

export type ReleaseClaimBlockReason = 'zeroAmount' | 'lockedUnknown'

/**
 * 释放队列 / 本金释放领取的写前阻断。
 *
 * 锁定状态未知时合约可能拒绝，按阻断处理；可领额非正时提交必然失败。
 *
 * @param args.claimable 可领取金额
 * @param args.unknownLocked 锁定状态是否未知
 * @returns 阻断原因
 * @see 手册 §12.4 用户写方法
 */
export function releaseClaimBlockReason(args: {
  claimable: bigint
  unknownLocked: boolean
}): ReleaseClaimBlockReason | null {
  if (args.unknownLocked) return 'lockedUnknown'
  if (args.claimable <= 0n) return 'zeroAmount'
  return null
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
