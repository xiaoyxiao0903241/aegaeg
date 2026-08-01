import { useState } from 'react'

import type { ExchangeTokenKey } from '~/app/data'
import { useI18n } from '~/i18n/use-i18n'

/** Content only needs rate scalars — not the full trade session bag. */
export function useMarketTradeContentView(exchangePriceLabel: string) {
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
