import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { getErrorMessage } from '~/web3/errors/get-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'
import { toast } from 'sonner'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'

/** Session state + i18n + flip/present orchestration → everything `FlashExchangeWidget` renders. */
export function useFlashExchangeView(flash: FlashExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const { pair } = flash

  const { isFlipping, rotation, flipCardClass, onFlip } = useExchangeFlip({
    flipDirection: flash.flipDirection,
    disabled: !flash.canFlip || flash.isSubmitting || (sessionReady && !flash.walletReady),
  })

  const showRateSkeleton = flash.isExchangePriceQuoting && !flash.exchangePriceLabel
  const showBuyAmountSkeleton =
    sessionReady && flash.isQuoting && flash.sellAmount.trim().length > 0

  const pairOptions = [
    { label: t.exchange.flash.pairs.gagx, value: 'gagx' },
    { label: t.exchange.flash.pairs.usdt, value: 'usdt' },
  ]

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: flash.buyBalanceLabel,
    isBalancesLoading: flash.isBalancesLoading,
    sellBalanceLabel: flash.sellBalanceLabel,
    sessionReady,
    walletReady: flash.walletReady,
  })

  const gateHint = flash.usd1Gate != null ? t.exchange.flash.gates[flash.usd1Gate] : null

  usePresentUserFacingError(flash.validationError, (err) => getErrorMessage(err, t), {
    id: 'flash-exchange-quote-error',
    trigger: flash.quoteErrorUpdatedAt,
  })

  async function onSubmit() {
    // Errors toast via useChainMutation → getErrorMessage (avoid double toast).
    const result = await flash.submit()
    if (result.ok) toast.success(t.exchange.exchangeSuccess)
  }

  return {
    t,
    sessionReady,
    pair,
    isFlipping,
    rotation,
    flipCardClass,
    onFlip,
    onBack: () => setView('hub'),
    showRateSkeleton,
    showBuyAmountSkeleton,
    pairOptions,
    buyLabel,
    sellLabel,
    gateHint,
    onSubmit,
  }
}
