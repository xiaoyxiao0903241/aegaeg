import type { WriteButtonPhase } from '~/core/wallet/write-button-phase'

/** 释放 / 领取轨：钱包 + writeReady + path busy + 可领额度。 */
export function canClaimWhen(args: {
  walletReady: boolean
  writeReady: boolean
  /** 历史参数名；传入 `useChainMutation.isLocked`（busy，非仅闩锁）。 */
  unknownReceiptLocked: boolean
  claimable: bigint
  /** 若传入，还要求 planIndex 已解析（队列行）。 */
  planIndexOk?: boolean
}): boolean {
  if (!args.walletReady || !args.writeReady || args.unknownReceiptLocked) return false
  if (args.claimable <= 0n) return false
  if (args.planIndexOk === false) return false
  return true
}

/** 质押 / bond / xmine 主 CTA：path busy、提交中或未 writeReady 时禁用。 */
export function writeCtaDisabled(args: {
  /** 历史参数名；传入 `useChainMutation.isLocked`（busy，非仅闩锁）。 */
  unknownReceiptLocked: boolean
  isSubmitting: boolean
  writeReady: boolean
  walletReady: boolean
}): boolean {
  return args.unknownReceiptLocked || args.isSubmitting || !args.writeReady || !args.walletReady
}

/** 手册 §1.4 phase → CTA 文案（迁移 / 绑推荐 / 默认提交）。 */
export function writeCtaLabel(
  phase: WriteButtonPhase,
  copy: { accountMigrated: string; bindReferral: string; submit: string },
): string {
  if (phase === 'account_migrated') return copy.accountMigrated
  if (phase === 'need_referral') return copy.bindReferral
  return copy.submit
}

/** `{template}` 替换 `{balance}`；余额为空 → `''`（CountValue 可保留）。 */
export function formatAmountBalanceLabel(template: string, args: { balance: string }): string {
  if (args.balance.trim() === '') return ''
  return template.replace('{balance}', args.balance)
}
