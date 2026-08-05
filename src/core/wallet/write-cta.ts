import type { WriteButtonPhase } from '~/core/wallet/write-button-phase'

/** 释放 / 领取路径：钱包 + writeReady + 交易忙碌 + 可领额度。 */
export function canClaimWhen(args: {
  walletReady: boolean
  writeReady: boolean
  /** 历史参数名；传入 `useChainMutation.isLocked`（busy，非仅锁定）。 */
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

/** 质押 / bond / xmine 主 CTA：交易忙碌、提交中或未 writeReady 时禁用。 */
export function writeCtaDisabled(args: {
  /** 历史参数名；传入 `useChainMutation.isLocked`（busy，非仅锁定）。 */
  unknownReceiptLocked: boolean
  isSubmitting: boolean
  writeReady: boolean
  walletReady: boolean
}): boolean {
  return args.unknownReceiptLocked || args.isSubmitting || !args.writeReady || !args.walletReady
}

/**
 * 手册 §1.4 phase → CTA 文案（迁移 / 绑推荐 / 默认提交）。
 *
 * @param phase 写按钮状态
 * @param copy 三态文案
 * @returns 对应状态的 CTA 文案
 * @see 手册 §1.4 通用交易状态
 */
export function writeCtaLabel(
  phase: WriteButtonPhase,
  copy: { accountMigrated: string; bindReferral: string; submit: string },
): string {
  if (phase === 'account_migrated') return copy.accountMigrated
  if (phase === 'need_referral') return copy.bindReferral
  return copy.submit
}

/**
 * 用 `{balance}` 替换模板中的占位；余额为空时返回空串，避免覆盖外层
 * CountValue 的占位显示。
 *
 * @param template 含 `{balance}` 的模板文案
 * @param args.balance 余额文案
 * @returns 替换后的文案；余额为空返回空串
 */
export function formatAmountBalanceLabel(template: string, args: { balance: string }): string {
  if (args.balance.trim() === '') return ''
  return template.replace('{balance}', args.balance)
}
