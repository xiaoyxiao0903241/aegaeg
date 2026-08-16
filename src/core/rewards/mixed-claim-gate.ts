import { ZERO_BI } from '~/core/constants'
import { evaluateWriteButtonPhase, type WriteButtonPhase } from '~/core/wallet/write-button-phase'

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
  isLocked: boolean
  isPending: boolean
  contributionOk: boolean
  plansOk: boolean
  luckyOk: boolean
  claimable: bigint
  allowUnknownAmount: boolean
}): boolean {
  if (!args.walletReady || !args.writeReady || !args.sessionReady) return false
  if (args.isLocked || args.isPending) return false
  if (!args.plansOk || !args.contributionOk || !args.luckyOk) return false
  if (!args.allowUnknownAmount && args.claimable <= ZERO_BI) return false
  return true
}

/**
 * 奖励 Mixed 写按钮状态（与资产 / 质押同构；未登录视为未就绪钱包）。
 */
export function evaluateRewardsMixedClaimWritePhase(args: {
  walletReady: boolean
  writeReady: boolean
  sessionReady: boolean
  isSubmitting: boolean
  contributionOk: boolean
  plansOk: boolean
  luckyOk: boolean
  claimable: bigint
  allowUnknownAmount: boolean
}): WriteButtonPhase {
  const moneyBlock =
    !args.luckyOk || !args.plansOk || !args.contributionOk
      ? 'unavailable'
      : !args.allowUnknownAmount && args.claimable <= ZERO_BI
        ? 'zeroAmount'
        : null
  return evaluateWriteButtonPhase({
    walletReady: args.walletReady && args.sessionReady,
    writeReady: args.writeReady,
    needReferral: false,
    moneyBlock,
    isSubmitting: args.isSubmitting,
  })
}
