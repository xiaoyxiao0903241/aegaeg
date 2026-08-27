import { parseTokenAmount } from '~/core/exchange/token-amount'

/**
 * 领取消耗比文案（产品 / 后端 DAO：1 点对应 1 领取额）。
 * 不读链上 contributionDivisor（那是 Mixed consume 的除数，不是领取比）。
 *
 * @see docs/backend-api/api.md #claim/dao-reward
 */
export const CONTRIBUTION_CLAIM_RATIO_LABEL = '1:1'

/**
 * 把 API 十进制金额转最小单位。空 / 非法为 null（不当成 0，避免误拦或误放行）。
 *
 * @param raw 十进制字符串（可带逗号）
 * @param decimals 与 AGX 相同的精度
 * @returns 最小单位；空 / 非法为 null
 */
export function parseApiTokenWei(raw: string | null | undefined, decimals: number): bigint | null {
  if (raw == null) return null
  const trimmed = String(raw).trim().replace(/,/g, '')
  if (!trimmed) return null
  if (!/^\d+(\.\d*)?$/.test(trimmed)) return null
  return parseTokenAmount(trimmed, decimals)
}

export type DaoClaimContributionPreview = {
  requiredWei: bigint
  availableWei: bigint
  ok: boolean
}

/**
 * DAO 签名前 / 资产 Mixed 确认：所需 = 领取额（1:1）。
 *
 * 领取额或可用点未知时返回 null，不预拦，交给签名接口裁决。
 *
 * @param args.claimAmountWei 待领金额；null 表示尚未可知
 * @param args.availableWei 后端 available_contribution；null 表示尚未可知
 * @returns 1:1 预检结果；未知金额为 null
 * @see docs/backend-api/api.md #claim/dao-reward
 */
export function previewDaoClaimContribution(args: {
  claimAmountWei: bigint | null
  availableWei: bigint | null
}): DaoClaimContributionPreview | null {
  const { claimAmountWei, availableWei } = args
  if (claimAmountWei == null || availableWei == null) return null
  if (claimAmountWei <= 0n) return null
  return {
    requiredWei: claimAmountWei,
    availableWei,
    ok: availableWei >= claimAmountWei,
  }
}
