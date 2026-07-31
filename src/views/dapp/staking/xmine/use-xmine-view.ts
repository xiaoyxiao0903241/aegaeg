import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useXmineWidget } from '~/views/dapp/staking/xmine/use-xmine-widget'
import { XMINE_GATE_ERROR } from '~/views/dapp/staking/xmine/submit-xmine'
import { formatAmountBalanceLabel } from '~/core/wallet/write-cta'
import { messageFromSentinels } from '~/web3/errors/message-from-sentinels'
import { presentSubmitResult } from '~/web3/present-submit-result'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function useXmineView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const xmine = useXmineWidget(sessionReady)

  const amountLabel = formatAmountBalanceLabel(t.staking.xmine.amountBalance, {
    loading: xmine.isBalancesLoading,
    balance: xmine.balanceLabel,
  })

  function toUserMessage(error: unknown) {
    return messageFromSentinels(
      error,
      [
        [XMINE_GATE_ERROR.insufficientBalance, t.staking.gates.insufficientGagx],
        [XMINE_GATE_ERROR.insufficientAllowance, t.staking.gates.insufficientAllowance],
        [XMINE_GATE_ERROR.insufficientQuota, t.staking.gates.insufficientQuota],
        [XMINE_GATE_ERROR.zeroAmount, t.staking.gates.zeroAmount],
        [XMINE_GATE_ERROR.unavailable, t.staking.gates.unavailable],
      ],
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ?? t.errors.chain.fallback,
    )
  }

  async function onSubmit() {
    const result = await xmine.submit()
    await presentSubmitResult(result, t.staking.xmine.success, toUserMessage)
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
