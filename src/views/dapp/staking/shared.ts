import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { evaluateWriteButtonPhase } from '~/core/wallet/write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { formatNumber, parseApiAmount as parseApiAmountNullable } from '~/shared/presenters/format'

type StakingMoneyBlock = Parameters<typeof evaluateWriteButtonPhase>[0]['moneyBlock']

/** 旁注金额：API 非法时兜底 0（解析的唯一来源仍是 format `parseApiAmount`）。 */
export function parseApiAmountOrZero(raw: string | undefined): number {
  return parseApiAmountNullable(raw) ?? 0
}

/** rebaseRate1e18 → `x.xx%`；缺失回落 `0.00%`。 */
export function formatRebasePct(rate1e18: bigint | null | undefined): string {
  const zero = `${formatNumber(0, { digits: 2 })}%`
  if (rate1e18 == null) return zero
  const pct = formatTokenAmountToNumber(rate1e18, 18)
  if (!Number.isFinite(pct)) return zero
  return `${formatNumber(pct, { digits: 2 })}%`
}

/**
 * 质押 / 债券写入按钮是否可点、处于哪一阶段
 *
 * 授权不足时按钮仍可点，点下去会先补授权再提交。
 * 正在估算到账金额、或还在用上一笔金额的旧结果时，按钮不可点。
 *
 * @param args 写入状态、金额、阻塞原因等输入
 * @returns locked / canSubmit / writePhase 三态
 */
export function evaluateStakingAmountWrite(args: {
  unknownReceiptLocked: boolean
  isSubmitting: boolean
  writeReady: boolean
  walletReady: boolean
  amountIn: bigint
  blockReason: StakingMoneyBlock
  preflightReady: boolean
  needReferral: boolean
  accountMigrated: boolean
  /** 到账金额还在算，或仍是上一笔金额的旧结果。 */
  isQuoting?: boolean
}) {
  const locked = writeCtaDisabled({
    unknownReceiptLocked: args.unknownReceiptLocked,
    isSubmitting: args.isSubmitting,
    writeReady: args.writeReady,
    walletReady: args.walletReady,
  })

  const moneyOk = args.blockReason == null || args.blockReason === 'insufficientAllowance'
  const canSubmit =
    !locked && args.amountIn > 0n && moneyOk && args.preflightReady && !args.isQuoting

  const writePhase = evaluateWriteButtonPhase({
    walletReady: args.walletReady,
    writeReady: args.writeReady,
    needReferral: args.needReferral,
    accountMigrated: args.accountMigrated,
    moneyBlock: args.blockReason,
    isQuoting: args.isQuoting,
    isSubmitting: args.isSubmitting,
  })

  return { locked, canSubmit, writePhase }
}

/**
 * 编辑金额前先解锁（stake / bond 共用）
 *
 * @param unlock 解除未知回执锁定
 * @param amountInput 金额输入控制
 * @returns 包一层解锁的 setAmount / fillMax
 */
export function bindUnlockedAmountEditors(
  unlock: () => void,
  amountInput: {
    setAmount: (value: string) => void
    fillPercent: (percent: number) => void
  },
) {
  return {
    setAmount(value: string) {
      unlock()
      amountInput.setAmount(value)
    },
    fillMax() {
      unlock()
      amountInput.fillPercent(100)
    },
  }
}
