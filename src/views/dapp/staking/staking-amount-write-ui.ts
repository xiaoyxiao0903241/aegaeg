import { evaluateWriteButtonPhase } from '~/core/wallet/write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'

type StakingMoneyBlock = Parameters<typeof evaluateWriteButtonPhase>[0]['moneyBlock']

/**
 * 质押 / 债券写入按钮状态判定（共享）
 *
 * 授权不足不算阻塞：CTA 可点，由 approveThenLiveWrite 内联授权。
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
}) {
  const locked = writeCtaDisabled({
    unknownReceiptLocked: args.unknownReceiptLocked,
    isSubmitting: args.isSubmitting,
    writeReady: args.writeReady,
    walletReady: args.walletReady,
  })

  // 手册：先 approve 再 stake/zap；授权不足须可点 CTA，由 approveThenLiveWrite 内联授权。
  const moneyOk = args.blockReason == null || args.blockReason === 'insufficientAllowance'
  const canSubmit = !locked && args.amountIn > 0n && moneyOk && args.preflightReady

  const writePhase = evaluateWriteButtonPhase({
    walletReady: args.walletReady,
    writeReady: args.writeReady,
    needReferral: args.needReferral,
    accountMigrated: args.accountMigrated,
    moneyBlock: args.blockReason,
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
