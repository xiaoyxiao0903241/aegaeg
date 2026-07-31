import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useStakeWidget } from '~/views/dapp/staking/stake/use-stake-widget'
import { STAKING_GATE_ERROR } from '~/views/dapp/staking/stake/submit-stake'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function useStakeView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const stake = useStakeWidget(sessionReady)
  const selectTab = useDappShellStore((state) => state.selectTab)

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

  const amountLabel = t.staking.stake.amountBalance.replace(
    '{balance}',
    stake.isBalancesLoading ? '…' : `${stake.balanceLabel}`,
  )

  const ctaLabel =
    stake.writePhase === 'account_migrated'
      ? t.staking.gates.accountMigrated
      : stake.writePhase === 'need_referral'
        ? t.staking.stake.bindCta
        : t.staking.stake.submit

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === STAKING_GATE_ERROR.accountMigrated) return t.staking.gates.accountMigrated
    if (raw === STAKING_GATE_ERROR.notBound) return t.staking.gates.notBound
    if (raw === STAKING_GATE_ERROR.insufficientBalance) return t.staking.gates.insufficientBalance
    if (raw === STAKING_GATE_ERROR.insufficientAllowance)
      return t.staking.gates.insufficientAllowance
    if (raw === STAKING_GATE_ERROR.insufficientQuota) return t.staking.gates.insufficientQuota
    if (raw === STAKING_GATE_ERROR.poolPaused) return t.staking.gates.poolPaused
    if (raw === STAKING_GATE_ERROR.zeroAmount) return t.staking.gates.zeroAmount
    if (raw === STAKING_GATE_ERROR.unavailable) return t.staking.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function onSubmit() {
    if (stake.gate === 'accountMigrated') return
    if (stake.gate === 'notBound') {
      selectTab('community')
      return
    }
    const result = await stake.submit()
    if (result.ok) {
      toast.success(t.staking.stake.success)
      return
    }
    if (result.error != null) {
      const raw = readErrorText(result.error)
      if (raw === STAKING_GATE_ERROR.notBound) {
        selectTab('community')
        return
      }
      presentUserFacingError(result.error, resolveMessage)
    }
  }

  async function onWarmup() {
    const result = await stake.claimWarmup()
    if (result.ok) {
      toast.success(t.staking.stake.warmupSuccess)
      return
    }
    if (result.error != null) presentUserFacingError(result.error, resolveMessage)
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
