import { useDappShell } from '~/app/use-dapp-shell'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useI18n } from '~/i18n/use-i18n'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { submitExchangeWithSuccessToast } from '~/views/dapp/exchange/submit-exchange-success'
import { formatExchangeBalanceLabel } from '~/views/dapp/exchange/use-exchange-balance-labels'

/** Session state + i18n + present orchestration → everything `BurnExchangeWidget` renders. */
export function useBurnExchangeView(burn: BurnExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const { pair } = burn

  const sellBalanceLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: burn.sellBalanceLabel,
    sessionReady,
    walletReady: burn.walletReady,
  })
  const buyBalanceLabel = formatExchangeBalanceLabel({
    label: t.exchange.burn.currentContribution,
    value: burn.contributionBalanceLabel,
    sessionReady,
    walletReady: burn.walletReady,
  })

  const blockHint = burn.blockReason != null ? t.exchange.burn.blocked[burn.blockReason] : null

  usePresentUserFacingError(burn.validationError, {
    id: 'burn-exchange-quote-error',
    trigger: burn.quoteErrorUpdatedAt,
  })

  return {
    t,
    sessionReady,
    pair,
    onBack: () => setView('hub'),
    sellBalanceLabel,
    buyBalanceLabel,
    blockHint,
    onSubmit: () => submitExchangeWithSuccessToast(burn.submit, t.exchange.exchangeSuccess),
  }
}
