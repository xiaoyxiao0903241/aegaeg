import { toast } from 'sonner'

import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  periodYieldPct,
  stakePeriodDays,
} from '~/core/staking/staking-yield-display'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { STAKING_BLOCKED } from '~/views/dapp/staking/stake/submit-stake'
import { useStakeWidget } from '~/views/dapp/staking/stake/use-stake-widget'
import { readErrorText } from '~/web3/errors/error-text'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

const YIELD_EMPTY = `${formatGroupedNumber(0, { digits: 2 })}%`

function formatYieldPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatGroupedNumber(pct, { digits: 2 })}%`
}

function formatBonusPct(bps: number): string {
  return `${formatGroupedNumber(bps / 100, { digits: 0, trimZeros: true })}%`
}

export function useStakeView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const overviewQuery = useStakingHubOverviewQuery()

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
    balance: !sessionReady || !walletReady ? '0.00' : stake.balanceLabel,
  })

  const ctaLabel = writeCtaLabel(stake.writePhase, {
    accountMigrated: t.staking.blocked.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: t.staking.stake.submit,
  })

  const epochPct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const baseDaily = baseDailyPctFromEpoch(epochPct)
  const bonusBps = lockedBonusBps(stake.period)
  const yieldMeta = {
    baseDaily: formatYieldPct(baseDaily),
    periodYield: formatYieldPct(
      baseDaily == null ? null : periodYieldPct(baseDaily, stakePeriodDays(stake.period)),
    ),
    bonus: formatBonusPct(bonusBps),
  }

  async function onSubmit() {
    if (stake.blockReason === 'accountMigrated') return
    if (stake.blockReason === 'notBound') {
      goBindReferral()
      return
    }
    await stake.submit()
  }

  async function onWarmup() {
    await stake.claimWarmup()
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
    yieldMeta,
    onSubmit,
    onWarmup,
  }
}
