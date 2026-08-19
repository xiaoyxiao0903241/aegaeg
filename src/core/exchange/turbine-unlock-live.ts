/**
 * Turbine 解锁（buyAgxAndStartCooldown）的实时门闸。
 *
 * 数量非正、超过剩余配额、USD1 余额或授权不足时阻断，避免链上买入
 * 失败或超出个人配额。
 *
 * @param args.unlockAmountAgx 拟解锁的 AGX 数量
 * @param args.liveUsd 实时报价的 USD1 应付
 * @param args.liveQuota 用户剩余出售配额
 * @param args.usd1 钱包 USD1 余额
 * @param args.approved 对 Turbine 的授权（链上读数）
 * @param args.grantedUsd 本笔已挖出的授权额；未授权为 0。已授权则忽略滞后的链上额度；报价高于此值时硬挡。
 * @returns 阻断哨兵字符串；通过返回 null
 * @see 手册 §16 Turbine
 */
export function evaluateTurbineUnlockLive(args: {
  unlockAmountAgx: bigint
  liveUsd: bigint
  liveQuota: bigint
  usd1: bigint
  approved: bigint
  grantedUsd?: bigint
}): string | null {
  if (args.unlockAmountAgx <= 0n || args.liveUsd <= 0n) return 'TURBINE_ZERO_AMOUNT'
  if (args.unlockAmountAgx > args.liveQuota) return 'TURBINE_QUOTA_EXCEEDED'
  if (args.liveUsd > args.usd1) return 'TURBINE_INSUFFICIENT_USD1'
  const grantedUsd = args.grantedUsd ?? 0n
  if (grantedUsd > 0n) {
    if (args.liveUsd > grantedUsd) return 'TURBINE_QUOTE_EXCEEDS_APPROVAL'
  } else if (args.liveUsd > args.approved) {
    return 'TURBINE_INSUFFICIENT_ALLOWANCE'
  }
  return null
}

/**
 * Turbine 冷却领取（claimCooledGagx）的实时门闸。
 *
 * @param vested 冷却是否已到期（isVested）
 * @returns 未到期返回 'TURBINE_NOT_VESTED'；到期返回 null
 * @see 手册 §16 Turbine
 */
export function evaluateTurbineClaimLive(vested: boolean): string | null {
  if (!vested) return 'TURBINE_NOT_VESTED'
  return null
}
