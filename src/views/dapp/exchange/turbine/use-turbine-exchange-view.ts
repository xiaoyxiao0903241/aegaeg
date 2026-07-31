import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { exchangeUserFacingMessages } from '~/views/dapp/exchange/exchange-user-facing-messages'
import { presentExchangeSubmitResult } from '~/views/dapp/exchange/present-exchange-submit-result'

/** Session state + i18n + unlock/claim toast orchestration → everything `TurbineExchangeWidget` renders. */
export function useTurbineExchangeView(turbine: TurbineExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const exchangePreview = !sessionReady
  const showBalanceSkeleton = !exchangePreview && turbine.isBalancesLoading
  const sellDisabled = (sessionReady && !turbine.walletReady) || turbine.isSubmitting

  const segmentOptions = [
    { label: t.exchange.turbine.segments.unlock, value: 'unlock' },
    { label: t.exchange.turbine.segments.claim, value: 'claim' },
  ]

  const unlockableAmountLabel = exchangePreview
    ? '0.00 gAGX'
    : `${turbine.walletReady ? turbine.quotaLabel : '—'} gAGX`

  const usd1AmountLabel = exchangePreview
    ? '0.00'
    : turbine.walletReady
      ? turbine.usd1BalanceLabel
      : '—'

  const showWillReceiveSkeleton = sessionReady && turbine.isQuoting
  const willReceiveLabel = turbine.unlockAmount.trim().length > 0 ? turbine.buyAgxLabel : '—'

  function resolveTurbineMessage(error: unknown) {
    return resolveExchangeUserFacingMessage(
      error,
      exchangeUserFacingMessages(t),
      t.wallet.transactionErrors,
      t.errors.chain.fallback,
    )
  }

  const submitErrorMessage =
    !turbine.error || turbine.isSubmitting ? null : resolveTurbineMessage(turbine.error)

  async function handleUnlock() {
    const result = await turbine.submitUnlock()
    await presentExchangeSubmitResult(
      result,
      t.exchange.turbine.unlockSuccess,
      resolveTurbineMessage,
    )
  }

  async function handleClaim(index: number) {
    const result = await turbine.submitClaim(index)
    await presentExchangeSubmitResult(
      result,
      t.exchange.turbine.claimSuccess,
      resolveTurbineMessage,
    )
  }

  return {
    t,
    sessionReady,
    exchangePreview,
    showBalanceSkeleton,
    sellDisabled,
    segmentOptions,
    unlockableAmountLabel,
    usd1AmountLabel,
    showWillReceiveSkeleton,
    willReceiveLabel,
    submitErrorMessage,
    onBack: () => setView('hub'),
    handleUnlock,
    handleClaim,
  }
}
