import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useStakeWidget } from '~/views/dapp/staking/stake/use-stake-widget'
import { STAKING_BLOCKED } from '~/views/dapp/staking/stake/submit-stake'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { readErrorText } from '~/web3/errors/error-text'

export function useStakeView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()

  const stake = useStakeWidget(sessionReady, {
    onOpenSuccess: () => {
      toast.success(t.staking.stake.success)
    },
    onWarmupSuccess: () => {
      toast.success(t.staking.stake.warmupSuccess)
    },
    onError: (error) => {
      if (readErrorText(error) === STAKING_BLOCKED.notBound) goBindReferral()
    },
  })

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
    balance: stake.balanceLabel,
  })

  const ctaLabel = writeCtaLabel(stake.writePhase, {
    accountMigrated: t.staking.blocked.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: t.staking.stake.submit,
  })

  async function onSubmit() {
    if (stake.blockReason === 'accountMigrated') return
    if (stake.blockReason === 'notBound') {
      goBindReferral()
      return
    }
    await stake.submit()
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
    onWarmup: () => stake.claimWarmup(),
  }
}
