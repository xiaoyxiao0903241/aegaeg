import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useXmineWidget } from '~/views/dapp/staking/xmine/use-xmine-widget'
import { XMINE_GATE_ERROR } from '~/views/dapp/staking/xmine/submit-xmine'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function useXmineView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const xmine = useXmineWidget(sessionReady)

  const amountLabel = t.staking.xmine.amountBalance.replace(
    '{balance}',
    xmine.isBalancesLoading ? '…' : xmine.balanceLabel,
  )

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === XMINE_GATE_ERROR.insufficientBalance) return t.staking.gates.insufficientGagx
    if (raw === XMINE_GATE_ERROR.insufficientAllowance) return t.staking.gates.insufficientAllowance
    if (raw === XMINE_GATE_ERROR.insufficientQuota) return t.staking.gates.insufficientQuota
    if (raw === XMINE_GATE_ERROR.zeroAmount) return t.staking.gates.zeroAmount
    if (raw === XMINE_GATE_ERROR.unavailable) return t.staking.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function onSubmit() {
    const result = await xmine.submit()
    if (result.ok) {
      toast.success(t.staking.xmine.success)
      return
    }
    if (result.error != null) presentUserFacingError(result.error, resolveMessage)
  }

  return {
    t,
    xmine,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    onSubmit,
  }
}
