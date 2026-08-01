/** Turbine unlock：approve 后 live 门闸。返回哨兵字符串或 null（通过）。 */
export function evaluateTurbineUnlockLive(args: {
  unlockAmountAgx: bigint
  liveUsd: bigint
  liveQuota: bigint
  usd1: bigint
  approved: bigint
}): string | null {
  if (args.unlockAmountAgx <= 0n || args.liveUsd <= 0n) return 'TURBINE_ZERO_AMOUNT'
  if (args.unlockAmountAgx > args.liveQuota) return 'TURBINE_QUOTA_EXCEEDED'
  if (args.liveUsd > args.usd1) return 'TURBINE_INSUFFICIENT_USD1'
  if (args.liveUsd > args.approved) return 'TURBINE_INSUFFICIENT_ALLOWANCE'
  return null
}
