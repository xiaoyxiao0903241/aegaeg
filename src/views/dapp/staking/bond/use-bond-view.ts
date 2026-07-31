import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { BOND_ZAP_GATE_ERROR, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function useBondView(kind: BondKind) {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const bond = useBondWidget(kind, sessionReady)
  const selectTab = useDappShellStore((state) => state.selectTab)
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const ctaLabel =
    bond.writePhase === 'account_migrated'
      ? t.staking.gates.accountMigrated
      : bond.writePhase === 'need_referral'
        ? t.staking.stake.bindCta
        : copy.submit

  const amountLabel = copy.amountBalance.replace(
    '{balance}',
    bond.isBalancesLoading ? '…' : bond.balanceLabel,
  )

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === BOND_ZAP_GATE_ERROR.accountMigrated) return t.staking.gates.accountMigrated
    if (raw === BOND_ZAP_GATE_ERROR.notBound) return t.staking.gates.notBound
    if (raw === BOND_ZAP_GATE_ERROR.insufficientBalance) return t.staking.gates.insufficientBalance
    if (raw === BOND_ZAP_GATE_ERROR.insufficientAllowance)
      return t.staking.gates.insufficientAllowance
    if (raw === BOND_ZAP_GATE_ERROR.depositoryNotAuth) return t.staking.gates.depositoryNotAuth
    if (raw === BOND_ZAP_GATE_ERROR.zeroAmount) return t.staking.gates.zeroAmount
    if (raw === BOND_ZAP_GATE_ERROR.unavailable) return t.staking.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function onSubmit() {
    if (bond.gate === 'accountMigrated') return
    if (bond.gate === 'notBound') {
      selectTab('community')
      return
    }
    const result = await bond.submit()
    if (result.ok) {
      toast.success(copy.success)
      return
    }
    if (result.error != null) {
      const raw = readErrorText(result.error)
      if (raw === BOND_ZAP_GATE_ERROR.notBound) {
        selectTab('community')
        return
      }
      presentUserFacingError(result.error, resolveMessage)
    }
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
