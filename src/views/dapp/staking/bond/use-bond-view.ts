import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { BOND_ZAP_GATE_ERROR, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { readErrorText } from '~/web3/errors/error-text'

export function useBondView(kind: BondKind) {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const bond = useBondWidget(kind, sessionReady, {
    onSuccess: () => {
      toast.success(copy.success)
    },
    onError: (error) => {
      if (readErrorText(error) === BOND_ZAP_GATE_ERROR.notBound) goBindReferral()
    },
  })

  const ctaLabel = writeCtaLabel(bond.writePhase, {
    accountMigrated: t.staking.gates.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: copy.submit,
  })

  const amountLabel = formatAmountBalanceLabel(copy.amountBalance, {
    loading: bond.isBalancesLoading,
    balance: bond.balanceLabel,
  })

  async function onSubmit() {
    if (bond.gate === 'accountMigrated') return
    if (bond.gate === 'notBound') {
      goBindReferral()
      return
    }
    await bond.submit()
  }

  return {
    t,
    bond,
    copy,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    ctaLabel,
    onSubmit,
    periodLabels: {
      '180': t.staking.stake.periods.d180,
      '360': t.staking.stake.periods.d360,
      '540': t.staking.stake.periods.d540,
    },
  }
}
