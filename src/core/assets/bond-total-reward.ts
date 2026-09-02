import { parseTokenAmount } from '~/core/exchange/token-amount'

/**
 * 债券仓位「总收益」最小单位：接口已领 + 链上未领 Rebase（profit）。
 *
 * LP / 销毁共用。已领缺失或非法时返回 null（展示 —），不把未领当成总额。
 * 未领非法或负数按 0。
 *
 * @param args.claimedRaw `/bond-flow/lp-reward-total` 或 `/bond-flow/burn-reward-total` 的 `total_reward`（gAGX）
 * @param args.unclaimedWei 各仓 `profit` 之和
 * @param args.decimals gAGX 精度
 * @returns 总收益 wei；无法合成时 null
 * @see src/views/dapp/assets/position/use-position.ts
 */
export function bondTotalRewardWei(args: {
  claimedRaw: string | null | undefined
  unclaimedWei: bigint
  decimals: number
}): bigint | null {
  if (args.claimedRaw == null) return null
  const trimmed = args.claimedRaw.trim()
  if (trimmed === '' || !/^\d+(\.\d*)?$/.test(trimmed.replace(/,/g, ''))) return null
  const claimedWei = parseTokenAmount(trimmed, args.decimals)
  const unclaimedWei = args.unclaimedWei > 0n ? args.unclaimedWei : 0n
  return claimedWei + unclaimedWei
}
