import { useState } from 'react'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { isTradeTokenKey, type TradeTokenKey } from '~/views/dapp/exchange/exchange-pair'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import { submitExchangeWithSuccessToast } from '~/views/dapp/exchange/submit-exchange-success'

function mapTradePickerOptions(keys: readonly TradeTokenKey[], trade: MarketTradeState) {
  return keys.map((key) => {
    const token = trade.getToken(key)
    return {
      key,
      symbol: token.symbol,
      icon: token.icon,
      balanceLabel: trade.balanceLabelFor(key),
      disabled: !trade.isTokenLive(key),
    }
  })
}

/** Session state + i18n + flip/present orchestration → everything `MarketTradeWidget` renders. */
export function useMarketTradeView(trade: MarketTradeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const [slippageOpen, setSlippageOpen] = useState(false)
  const [exchangePriceInverted, setExchangePriceInverted] = useState(false)

  const { pair } = trade
  const { isFlipping, rotation, flipCardClass, onFlip } = useExchangeFlip({
    flipDirection: trade.flipDirection,
    disabled: sessionReady && !trade.walletReady,
  })

  const showRateSkeleton = exchangePriceInverted
    ? trade.isExchangePriceInvertedQuoting && !trade.exchangePriceLabelInverted
    : trade.isExchangePriceQuoting && !trade.exchangePriceLabel
  const exchangePriceDisplayLabel = exchangePriceInverted
    ? trade.exchangePriceLabelInverted
    : trade.exchangePriceLabel
  const showBuyAmountSkeleton =
    sessionReady && trade.isQuoting && trade.sellAmount.trim().length > 0

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: trade.buyBalanceLabel,
    isBalancesLoading: trade.isBalancesLoading,
    sellBalanceLabel: trade.sellBalanceLabel,
    sessionReady,
    walletReady: trade.walletReady,
  })

  const pickDisabled = trade.isSubmitting || (sessionReady && !trade.walletReady) || isFlipping
  const sellPickerOptions = mapTradePickerOptions(trade.sellPickerKeys, trade)
  const buyPickerOptions = mapTradePickerOptions(trade.buyPickerKeys, trade)

  function handleTokenPick(side: 'sell' | 'buy', key: string) {
    if (!isTradeTokenKey(key) || !trade.isTokenLive(key)) return
    if (side === 'sell') trade.selectSellToken(key)
    else trade.selectBuyToken(key)
  }

  // Quote/validation only — submit errors toast via useChainMutation.
  usePresentUserFacingError(trade.validationError, {
    id: 'market-trade-quote-error',
    trigger: trade.quoteErrorUpdatedAt,
  })

  return {
    t,
    sessionReady,
    pair,
    isFlipping,
    rotation,
    flipCardClass,
    onFlip,
    onBack: () => setView('hub'),
    slippageOpen,
    setSlippageOpen,
    exchangePriceDisplayLabel,
    onTogglePriceInverted: () => setExchangePriceInverted((inverted) => !inverted),
    showRateSkeleton,
    showBuyAmountSkeleton,
    buyLabel,
    sellLabel,
    pickDisabled,
    sellPickerOptions,
    buyPickerOptions,
    handleTokenPick,
    onSubmit: () => submitExchangeWithSuccessToast(trade.submit, t.exchange.exchangeSuccess),
    onOpenPancakeSwap: () => openPancakeSwapDeepLink(trade.pancakeSwapUrl),
  }
}
