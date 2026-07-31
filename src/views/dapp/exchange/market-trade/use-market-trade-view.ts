import { useState } from 'react'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { isTradeTokenKey } from '~/views/dapp/exchange/exchange-pair'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { exchangeUserFacingMessages } from '~/views/dapp/exchange/exchange-user-facing-messages'
import { presentExchangeSubmitResult } from '~/views/dapp/exchange/present-exchange-submit-result'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'

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
  const sellPickerOptions = trade.sellPickerKeys.map((key) => {
    const token = trade.getToken(key)
    return {
      key,
      symbol: token.symbol,
      icon: token.icon,
      balanceLabel: trade.balanceLabelFor(key),
      disabled: !trade.isTokenLive(key),
    }
  })
  const buyPickerOptions = trade.buyPickerKeys.map((key) => {
    const token = trade.getToken(key)
    return {
      key,
      symbol: token.symbol,
      icon: token.icon,
      balanceLabel: trade.balanceLabelFor(key),
      disabled: !trade.isTokenLive(key),
    }
  })

  function handleTokenPick(side: 'sell' | 'buy', key: string) {
    if (!isTradeTokenKey(key) || !trade.isTokenLive(key)) return
    if (side === 'sell') trade.selectSellToken(key)
    else trade.selectBuyToken(key)
  }

  function resolveTradeMessage(error: unknown) {
    return resolveExchangeUserFacingMessage(
      error,
      exchangeUserFacingMessages(t),
      t.wallet.transactionErrors,
      t.errors.chain.fallback,
    )
  }

  // Quote/validation only — submit errors toast in onSubmit so the same sentinel re-fires.
  usePresentUserFacingError(trade.validationError, resolveTradeMessage, {
    id: 'market-trade-quote-error',
    trigger: trade.quoteErrorUpdatedAt,
  })

  async function onSubmit() {
    const result = await trade.submit()
    await presentExchangeSubmitResult(result, t.exchange.exchangeSuccess, resolveTradeMessage)
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
    onSubmit,
    onOpenPancakeSwap: () => openPancakeSwapDeepLink(trade.pancakeSwapUrl),
  }
}
