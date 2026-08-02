import { evaluateWriteButtonPhase } from '~/core/wallet/write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'

type StakingMoneyBlock = Parameters<typeof evaluateWriteButtonPhase>[0]['moneyBlock']

/** Shared locked / canSubmit / writePhase for stake + bond amount writes. */
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

/** Unlock-then-edit amount helpers shared by stake / bond widgets. */
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
