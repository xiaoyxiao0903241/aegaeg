import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { BOND_ZAP_GATE_ERROR, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { messageFromSentinels } from '~/web3/errors/message-from-sentinels'
import { presentSubmitResult } from '~/web3/present-submit-result'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function useBondView(kind: BondKind) {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const bond = useBondWidget(kind, sessionReady)
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const ctaLabel = writeCtaLabel(bond.writePhase, {
    accountMigrated: t.staking.gates.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: copy.submit,
  })

  const amountLabel = formatAmountBalanceLabel(copy.amountBalance, {
    loading: bond.isBalancesLoading,
    balance: bond.balanceLabel,
  })

  function toUserMessage(error: unknown) {
    return messageFromSentinels(
      error,
      [
        [BOND_ZAP_GATE_ERROR.accountMigrated, t.staking.gates.accountMigrated],
        [BOND_ZAP_GATE_ERROR.notBound, t.staking.gates.notBound],
        [BOND_ZAP_GATE_ERROR.insufficientBalance, t.staking.gates.insufficientBalance],
        [BOND_ZAP_GATE_ERROR.insufficientAllowance, t.staking.gates.insufficientAllowance],
        [BOND_ZAP_GATE_ERROR.depositoryNotAuth, t.staking.gates.depositoryNotAuth],
        [BOND_ZAP_GATE_ERROR.zeroAmount, t.staking.gates.zeroAmount],
        [BOND_ZAP_GATE_ERROR.unavailable, t.staking.gates.unavailable],
      ],
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ?? t.errors.chain.fallback,
    )
  }

  async function onSubmit() {
    if (bond.gate === 'accountMigrated') return
    if (bond.gate === 'notBound') {
      goBindReferral()
      return
    }
    const result = await bond.submit()
    if (
      !result.ok &&
      result.error != null &&
      readErrorText(result.error) === BOND_ZAP_GATE_ERROR.notBound
    ) {
      goBindReferral()
      return
    }
    await presentSubmitResult(result, copy.success, toUserMessage)
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
