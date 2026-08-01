import { useState } from 'react'

import type { ExchangeTokenKey } from '~/app/data'
import { useI18n } from '~/i18n/use-i18n'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'

export function useMarketTradeContentView(trade: MarketTradeState) {
  const { messages: t } = useI18n()
  const [faqToken, setFaqToken] = useState<ExchangeTokenKey>('trade')
  return {
    t,
    poolRateLabel: trade.exchangePriceLabel,
    poolRateLoading: trade.isExchangePriceQuoting,
    faqToken,
    setFaqToken,
    faqItems: t.exchange.faq.tabs[faqToken].items,
  }
}
