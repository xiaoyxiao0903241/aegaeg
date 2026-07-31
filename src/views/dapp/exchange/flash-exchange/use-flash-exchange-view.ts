import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  resolveExchangeUserFacingMessage,
  resolveFlashExchangeError,
} from '~/web3/resolve-contract-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'
import { exchangeUserFacingMessages } from '~/views/dapp/exchange/exchange-user-facing-messages'
import { presentExchangeSubmitResult } from '~/views/dapp/exchange/present-exchange-submit-result'
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

  function resolveFlashMessage(error: unknown) {
    return (
      resolveFlashExchangeError(error, t.exchange.flash.gates) ??
      resolveExchangeUserFacingMessage(
        error,
        exchangeUserFacingMessages(t),
        t.wallet.transactionErrors,
        t.errors.chain.fallback,
      )
    )
  }

  const gateHint = flash.usd1Gate != null ? t.exchange.flash.gates[flash.usd1Gate] : null
  const submitErrorMessage =
    !flash.error || flash.isSubmitting ? null : resolveFlashMessage(flash.error)

  usePresentUserFacingError(flash.validationError, resolveFlashMessage, {
    id: 'flash-exchange-quote-error',
    trigger: flash.quoteErrorUpdatedAt,
  })

  async function onSubmit() {
    const result = await flash.submit()
    await presentExchangeSubmitResult(result, t.exchange.exchangeSuccess, resolveFlashMessage)
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
    submitErrorMessage,
    onSubmit,
  }
}
