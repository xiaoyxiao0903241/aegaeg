import type { WriteButtonPhase } from '~/core/wallet/write-button-phase'
import { interpolate } from '~/i18n/interpolate'

/** 余额未知时显示零值；核心层不依赖 shared 展示工具。 */
function zeroGroupedPlaceholder(digits: number): string {
  return digits > 0 ? `0.${'0'.repeat(digits)}` : '0'
}

/** 不弹 InlineAlert：内联授权、未输入、去绑定职责，或仍在加载/未知（勿当最终硬门吓人）。 */
const WRITE_BLOCK_NO_ALERT = new Set([
  'insufficientAllowance',
  'zeroAmount',
  'notBound',
  'unavailable',
])

/**
 * 硬门才需要 InlineAlert（额度 / 已确认迁移 / 池未开等）。
 * 「去绑定」改写按钮；`unavailable` 多为迁移/预检未就绪，只灰钮不告警。
 *
 * @param reason 写门闸原因；null = 无阻断
 */
export function isHardWriteBlockReason(reason: string | null | undefined): boolean {
  if (reason == null) return false
  return !WRITE_BLOCK_NO_ALERT.has(reason)
}

/**
 * 把硬门原因映射成提示文案；软门 / 绑推荐 / 未知键返回 null。
 *
 * @param reason 写门闸原因
 * @param copy 原因 → 文案表（通常来自 i18n blocked）
 */
export function writeBlockHint<R extends string>(
  reason: R | null | undefined,
  copy: Partial<Record<R, string>>,
): string | null {
  if (!isHardWriteBlockReason(reason)) return null
  return copy[reason as R] ?? null
}

/**
 * 按钮职责文案：仅「去绑定推荐」改写主 CTA；迁移等长说明走 InlineAlert。
 *
 * @param phase 写按钮相位
 * @param copy 绑定 / 默认提交文案
 */
export function writeCtaLabel(
  phase: WriteButtonPhase,
  copy: { bindReferral: string; submit: string },
): string {
  if (phase === 'need_referral') return copy.bindReferral
  return copy.submit
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
 * 未知回执只闩住上次意图；提交在途仍挡住整条写路径。
 *
 * @param pathBusy `useChainMutation.isLocked`（latched 或 in-flight）
 * @param pathLatched `useChainMutation.isLatched`（仅未知回执）
 * @param latchedIntent 上次提交的意图
 * @param intent 当前 CTA 的意图
 */
export function unknownReceiptLocksIntent<T>(args: {
  pathBusy: boolean
  pathLatched: boolean
  latchedIntent: T | null
  intent: T
}): boolean {
  if (!args.pathBusy) return false
  if (!args.pathLatched) return true
  return args.latchedIntent === args.intent
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
