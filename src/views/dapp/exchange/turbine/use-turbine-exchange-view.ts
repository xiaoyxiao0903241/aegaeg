import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'

/** Session state + i18n + unlock/claim toast orchestration → everything `TurbineExchangeWidget` renders. */
export function useTurbineExchangeView(turbine: TurbineExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const exchangePreview = !sessionReady
  const sellDisabled = (sessionReady && !turbine.walletReady) || turbine.isSubmitting

  const segmentOptions = [
    { label: t.exchange.turbine.segments.unlock, value: 'unlock' },
    { label: t.exchange.turbine.segments.claim, value: 'claim' },
  ]

  const unlockableAmountLabel = exchangePreview
    ? '0.00 gAGX'
    : !turbine.walletReady
      ? '0 gAGX'
      : turbine.quotaLabel === ''
        ? ''
        : `${turbine.quotaLabel} gAGX`

  const usd1AmountLabel = exchangePreview
    ? '0.00'
    : !turbine.walletReady
      ? '0'
      : turbine.usd1BalanceLabel

  const willReceiveLabel = turbine.unlockAmount.trim().length > 0 ? turbine.buyAgxLabel : '—'

  async function handleUnlock() {
    // Errors toast via useChainMutation → getErrorMessage (avoid double toast).
    const result = await turbine.submitUnlock()
    if (result.ok) toast.success(t.exchange.turbine.unlockSuccess)
  }

  async function handleClaim(index: number) {
    const result = await turbine.submitClaim(index)
    if (result.ok) toast.success(t.exchange.turbine.claimSuccess)
  }

  return {
    t,
    sessionReady,
    exchangePreview,
    sellDisabled,
    segmentOptions,
    unlockableAmountLabel,
    usd1AmountLabel,
    willReceiveLabel,
    onBack: () => setView('hub'),
    handleUnlock,
    handleClaim,
  }
}
