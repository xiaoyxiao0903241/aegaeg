import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { getErrorMessage } from '~/web3/errors/get-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { toast } from 'sonner'
import { formatExchangeBalanceLabel } from '~/views/dapp/exchange/use-exchange-balance-labels'

/** Session state + i18n + present orchestration → everything `BurnExchangeWidget` renders. */
export function useBurnExchangeView(burn: BurnExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const { pair } = burn

  const showRateSkeleton = burn.isExchangePriceQuoting && !burn.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && burn.isQuoting && burn.sellAmount.trim().length > 0

  // S6: same skeleton / preview / disconnected shape as useExchangeBalanceLabels, different labels.
  const sellBalanceLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: burn.sellBalanceLabel,
    isBalancesLoading: burn.isBalancesLoading,
    sessionReady,
    walletReady: burn.walletReady,
  })
  const buyBalanceLabel = formatExchangeBalanceLabel({
    label: t.exchange.burn.currentContribution,
    value: burn.contributionBalanceLabel,
    isBalancesLoading: burn.isBalancesLoading,
    sessionReady,
    walletReady: burn.walletReady,
  })

  const gateHint = burn.gate != null ? t.exchange.burn.gates[burn.gate] : null

  usePresentUserFacingError(burn.validationError, (err) => getErrorMessage(err, t), {
    id: 'burn-exchange-quote-error',
    trigger: burn.quoteErrorUpdatedAt,
  })

  async function onSubmit() {
    // Errors toast via useChainMutation → getErrorMessage (avoid double toast).
    const result = await burn.submit()
    if (result.ok) toast.success(t.exchange.exchangeSuccess)
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
    onSubmit,
  }
}
