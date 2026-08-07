import type { WriteButtonPhase } from '~/core/wallet/write-button-phase'
import { interpolate } from '~/i18n/interpolate'

/** 余额未知时显示零值；核心层不依赖 shared 展示工具。 */
function zeroGroupedPlaceholder(digits: number): string {
  return digits > 0 ? `0.${'0'.repeat(digits)}` : '0'
}

/**
 * 释放 / 领取路径是否可发起写交易。
 *
 * 需要钱包已连接、处于预期链、回执状态已知，并且可领额度为正；
 * 队列行还需已解析计划索引。
 */
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

/**
 * 质押 / 债券 / xmine 主 CTA 是否禁用。
 *
 * 回执状态未知、正在提交或钱包/链未就绪时禁用，避免重复或过早发起写交易。
 */
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
 * 用 `{balance}` 替换模板；余额未知时用零值兜底，保留整句完整文案
 *（如「数量（钱包余额 0.0000 AGX）」），禁止回空串导致 CountValue 裸 `0`。
 *
 * @param template 含 `{balance}` 的模板文案
 * @param args.balance 余额文案；空串 = 未加载 / 未连接
 * @param args.digits 未知时零占位小数位（默认 2）
 */
export function formatAmountBalanceLabel(
  template: string,
  args: { balance: string; digits?: number },
): string {
  const digits = Math.max(0, Math.floor(args.digits ?? 2))
  const balance = args.balance.trim() === '' ? zeroGroupedPlaceholder(digits) : args.balance.trim()
  return interpolate(template, { balance })
}
