import { ZERO_BI } from '~/core/constants'

/**
 * 奖励 Mixed 确认门闸（幸运 / 共建 / 推荐 / 参与）。
 *
 * 在资产 Mixed 同构条件上叠加：业务登录、幸运奖可领态；
 * Dao Mixed 签名前金额未知，不因可领额为 0 阻断。
 */
export function evaluateRewardsMixedClaimConfirmGate(args: {
  walletReady: boolean
  writeReady: boolean
  sessionReady: boolean
  isPending: boolean
  contributionOk: boolean
  plansOk: boolean
  luckyOk: boolean
  claimable: bigint
  allowUnknownAmount: boolean
}): boolean {
  if (!args.walletReady || !args.writeReady || !args.sessionReady) return false
  if (args.isPending) return false
  if (!args.plansOk || !args.contributionOk || !args.luckyOk) return false
  if (!args.allowUnknownAmount && args.claimable <= ZERO_BI) return false
  return true
}
