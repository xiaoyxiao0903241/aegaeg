import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useStakeWidget } from '~/views/dapp/staking/stake/use-stake-widget'
import { STAKING_GATE_ERROR } from '~/views/dapp/staking/stake/submit-stake'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { messageFromSentinels } from '~/web3/errors/message-from-sentinels'
import { presentSubmitResult } from '~/web3/present-submit-result'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function useStakeView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const stake = useStakeWidget(sessionReady)

  const periodOptions = [
    { label: t.staking.stake.periods.liquid, value: 'liquid' },
    { label: t.staking.stake.periods.d180, value: '180' },
    { label: t.staking.stake.periods.d360, value: '360' },
    { label: t.staking.stake.periods.d540, value: '540' },
  ]

  const lockLabel =
    stake.period === 'liquid'
      ? t.staking.stake.meta.lockLiquid
      : t.staking.stake.meta.lockDays.replace('{days}', stake.period)

  const amountLabel = formatAmountBalanceLabel(t.staking.stake.amountBalance, {
    loading: stake.isBalancesLoading,
    balance: stake.balanceLabel,
  })

  const ctaLabel = writeCtaLabel(stake.writePhase, {
    accountMigrated: t.staking.gates.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: t.staking.stake.submit,
  })

  function toUserMessage(error: unknown) {
    return messageFromSentinels(
      error,
      [
        [STAKING_GATE_ERROR.accountMigrated, t.staking.gates.accountMigrated],
        [STAKING_GATE_ERROR.notBound, t.staking.gates.notBound],
        [STAKING_GATE_ERROR.insufficientBalance, t.staking.gates.insufficientBalance],
        [STAKING_GATE_ERROR.insufficientAllowance, t.staking.gates.insufficientAllowance],
        [STAKING_GATE_ERROR.insufficientQuota, t.staking.gates.insufficientQuota],
        [STAKING_GATE_ERROR.poolPaused, t.staking.gates.poolPaused],
        [STAKING_GATE_ERROR.zeroAmount, t.staking.gates.zeroAmount],
        [STAKING_GATE_ERROR.unavailable, t.staking.gates.unavailable],
      ],
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ?? t.errors.chain.fallback,
    )
  }

  async function onSubmit() {
    if (stake.gate === 'accountMigrated') return
    if (stake.gate === 'notBound') {
      goBindReferral()
      return
    }
    const result = await stake.submit()
    if (
      !result.ok &&
      result.error != null &&
      readErrorText(result.error) === STAKING_GATE_ERROR.notBound
    ) {
      goBindReferral()
      return
    }
    await presentSubmitResult(result, t.staking.stake.success, toUserMessage)
  }

  async function onWarmup() {
    const result = await stake.claimWarmup()
    await presentSubmitResult(result, t.staking.stake.warmupSuccess, toUserMessage)
  }

  return {
    t,
    stake,
    sessionReady,
    walletReady,
    setView,
    periodOptions,
    lockLabel,
    amountLabel,
    ctaLabel,
    onSubmit,
    onWarmup,
  }
}
