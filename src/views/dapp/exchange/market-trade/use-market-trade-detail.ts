import { useState } from 'react'

import type { ExchangeTokenKey } from '~/app/data'
import { useI18n } from '~/i18n/use-i18n'

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
