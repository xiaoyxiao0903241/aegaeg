import { useState } from 'react'

import { useDappHost } from '~/hooks/use-dapp-host'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useI18n } from '~/i18n/use-i18n'
import type { ExchangeTokenKey } from '~/shared/config/exchange-token-keys'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  isSellOnlyTradeToken,
  isTradeTokenKey,
  type TradeTokenKey,
} from '~/views/dapp/exchange/shared'
import { submitExchangeWithSuccessToast } from '~/views/dapp/exchange/submit-with-success-toast'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { useExchangeFlip } from '~/views/dapp/exchange/use-exchange-flip'

function mapTradePickerOptions({
  keys,
  trade,
  side,
  xBuyDisabledHint,
}: {
  keys: readonly TradeTokenKey[]
  trade: MarketTradeState
  side: 'sell' | 'buy'
  xBuyDisabledHint: string
}) {
  return keys.map((key) => {
    const token = trade.getToken(key)
    const buyBlocked = side === 'buy' && isSellOnlyTradeToken(key)
    return {
      key,
      symbol: token.symbol,
      icon: token.icon,
      balanceLabel: trade.balanceLabelFor(key),
      disabled: buyBlocked,
      disabledHint: buyBlocked ? xBuyDisabledHint : undefined,
    }
  })
}

/** 组装市价交易面板渲染所需：会话状态 + 文案 + 翻转 / 错误提示编排。 */
export function useMarketTradeDock(trade: MarketTradeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappHost()
  const [exchangePriceInverted, setExchangePriceInverted] = useState(false)

  const { pair } = trade
  const flipBlocked = !trade.canFlip
  const { isFlipping, rotation, flipCardClass, onFlip } = useExchangeFlip({
    flipDirection: trade.flipDirection,
    disabled: flipBlocked || (sessionReady && !trade.walletReady),
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
  const sellPickerOptions = mapTradePickerOptions({
    keys: trade.sellPickerKeys,
    trade,
    side: 'sell',
    xBuyDisabledHint: t.exchange.trade.xBuyDisabledHint,
  })
  const buyPickerOptions = mapTradePickerOptions({
    keys: trade.buyPickerKeys,
    trade,
    side: 'buy',
    xBuyDisabledHint: t.exchange.trade.xBuyDisabledHint,
  })

  function handleTokenPick(side: 'sell' | 'buy', key: string) {
    if (!isTradeTokenKey(key)) return
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
    flipCardClass: flipBlocked ? undefined : flipCardClass,
    onFlip,
    flipDisabled:
      flipBlocked || trade.isSubmitting || (sessionReady && !trade.walletReady) || isFlipping,
    flipTooltip: flipBlocked ? t.exchange.trade.flipDisabledXSellOnly : t.exchange.flip,
    onBack: () => setView('hub'),
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
