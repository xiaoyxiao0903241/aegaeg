import { useDappShell } from '~/app/use-dapp-shell'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useI18n } from '~/i18n/use-i18n'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { submitExchangeWithSuccessToast } from '~/views/dapp/exchange/submit-exchange-success'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'

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

  const pairOptions = [
    { label: t.exchange.flash.pairs.gagx, value: 'gagx' },
    { label: t.exchange.flash.pairs.usdt, value: 'usdt' },
  ]

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: flash.buyBalanceLabel,
    sellBalanceLabel: flash.sellBalanceLabel,
    sessionReady,
    walletReady: flash.walletReady,
  })

  const blockHint = flash.usd1Block != null ? t.exchange.flash.blocked[flash.usd1Block] : null

  usePresentUserFacingError(flash.validationError, {
    id: 'flash-exchange-quote-error',
    trigger: flash.quoteErrorUpdatedAt,
  })

  return {
    t,
    onBack: () => setView('hub'),
    sessionReady,
    pair,
    isFlipping,
    rotation,
    flipCardClass,
    onFlip,
    pairOptions,
    buyLabel,
    sellLabel,
    blockHint,
    onSubmit: () => submitExchangeWithSuccessToast(flash.submit, t.exchange.flash.success),
  }
}
