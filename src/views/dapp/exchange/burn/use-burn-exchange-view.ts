import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { exchangeUserFacingMessages } from '~/views/dapp/exchange/exchange-user-facing-messages'
import { presentExchangeSubmitResult } from '~/views/dapp/exchange/present-exchange-submit-result'
import { buildExchangeBalanceLabel } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { BURN_GATE_ERROR } from '~/views/dapp/exchange/burn/submit-burn-exchange'
import { readErrorText } from '~/web3/errors/error-text'

/** Session state + i18n + present orchestration → everything `BurnExchangeWidget` renders. */
export function useBurnExchangeView(burn: BurnExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const { pair } = burn

  const showRateSkeleton = burn.isExchangePriceQuoting && !burn.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && burn.isQuoting && burn.sellAmount.trim().length > 0

  // S6: same skeleton / preview / disconnected shape as useExchangeBalanceLabels, different labels.
  const sellBalanceLabel = buildExchangeBalanceLabel({
    label: t.exchange.balance,
    value: burn.sellBalanceLabel,
    isBalancesLoading: burn.isBalancesLoading,
    sessionReady,
    walletReady: burn.walletReady,
  })
  const buyBalanceLabel = buildExchangeBalanceLabel({
    label: t.exchange.burn.currentContribution,
    value: burn.contributionBalanceLabel,
    isBalancesLoading: burn.isBalancesLoading,
    sessionReady,
    walletReady: burn.walletReady,
  })

  function resolveBurnMessage(error: unknown) {
    const raw = readErrorText(error)
    const gateMessages = t.exchange.burn.gates
    if (raw === BURN_GATE_ERROR.paused) return gateMessages.paused
    if (raw === BURN_GATE_ERROR.belowMin) return gateMessages.belowMin
    if (raw === BURN_GATE_ERROR.aboveMax) return gateMessages.aboveMax
    if (raw === BURN_GATE_ERROR.zeroRate) return gateMessages.zeroRate

    return resolveExchangeUserFacingMessage(
      error,
      exchangeUserFacingMessages(t),
      t.wallet.transactionErrors,
      t.errors.chain.fallback,
    )
  }

  const gateHint = burn.gate != null ? t.exchange.burn.gates[burn.gate] : null
  const submitErrorMessage =
    !burn.error || burn.isSubmitting ? null : resolveBurnMessage(burn.error)

  usePresentUserFacingError(burn.validationError, resolveBurnMessage, {
    id: 'burn-exchange-quote-error',
    trigger: burn.quoteErrorUpdatedAt,
  })

  async function onSubmit() {
    const result = await burn.submit()
    await presentExchangeSubmitResult(result, t.exchange.exchangeSuccess, resolveBurnMessage)
  }

  return {
    t,
    sessionReady,
    pair,
    onBack: () => setView('hub'),
    showRateSkeleton,
    showBuyAmountSkeleton,
    sellBalanceLabel,
    buyBalanceLabel,
    gateHint,
    submitErrorMessage,
    onSubmit,
  }
}
