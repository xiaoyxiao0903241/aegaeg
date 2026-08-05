import { useState } from 'react'

import { useDappHost } from '~/hooks/use-dapp-host'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useI18n } from '~/i18n/use-i18n'
import type { ExchangeTokenKey } from '~/shared/config/data'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  isTradeTokenKey,
  submitExchangeWithSuccessToast,
  type TradeTokenKey,
} from '~/views/dapp/exchange/shared'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'

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

/** 组装市价交易面板渲染所需：会话状态 + 文案 + 翻转 / 错误提示编排。 */
export function useMarketTradeDock(trade: MarketTradeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappHost()
  const [slippageOpen, setSlippageOpen] = useState(false)
  const [exchangePriceInverted, setExchangePriceInverted] = useState(false)

  const { pair } = trade
  const { isFlipping, rotation, flipCardClass, onFlip } = useExchangeFlip({
    flipDirection: trade.flipDirection,
    disabled: sessionReady && !trade.walletReady,
  })

  const exchangePriceDisplayLabel = exchangePriceInverted
    ? trade.exchangePriceLabelInverted
    : trade.exchangePriceLabel

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: trade.buyBalanceLabel,
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

  // 仅报价校验错误在此提示；提交错误由写链统一 toast
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
    buyLabel,
    sellLabel,
    pickDisabled,
    sellPickerOptions,
    buyPickerOptions,
    handleTokenPick,
    onSubmit: () => submitExchangeWithSuccessToast(trade.submit, t.exchange.trade.success),
    onOpenPancakeSwap: () => openPancakeSwapDeepLink(trade.pancakeSwapUrl),
  }
}

/** 详情页只需汇率标量与 FAQ 的 Tab 状态，不取完整会话。 */
export function useMarketTradeDetail(exchangePriceLabel: string) {
  const { messages: t } = useI18n()
  const [faqToken, setFaqToken] = useState<ExchangeTokenKey>('trade')
  return {
    t,
    poolRateLabel: exchangePriceLabel,
    faqToken,
    setFaqToken,
    faqItems: t.exchange.faq.tabs[faqToken].items,
  }
}
