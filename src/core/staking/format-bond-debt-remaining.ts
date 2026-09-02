import { computeNetBondPayout } from '~/core/staking/bond-payout'

/**
 * 单笔债券可获得的 AGX 上限（净发放口径）。
 *
 * 取「maxPayout() 扣 fee」与「债务剩余」的较小值。
 * `maxDebt === 0` 表示债务层不启用，只受单笔 maxPayout 约束（不是不限购）。
 *
 * @param args.maxPayoutAmount `maxPayout()` 单笔毛上限
 * @param args.maxDebt `terms.maxDebt`；0 = 不启用债务上限
 * @param args.totalDeposit 已占用债务（净发放累计）
 * @param args.feeBps `terms.fee`
 * @returns 净 AGX 上限（与获得量同一口径）
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function bondPurchaseCapAgx(args: {
  maxPayoutAmount: bigint
  maxDebt: bigint
  totalDeposit: bigint
  feeBps: bigint
}): bigint {
  const fromPayout = computeNetBondPayout(args.maxPayoutAmount, args.feeBps)
  if (args.maxDebt === 0n) return fromPayout
  const remaining = args.maxDebt > args.totalDeposit ? args.maxDebt - args.totalDeposit : 0n
  return remaining < fromPayout ? remaining : fromPayout
}
