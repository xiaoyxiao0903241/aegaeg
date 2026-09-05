/**
 * 兑换买卖两侧的余额标签 hook
 *
 * 余额文案走 `formatExchangeBalanceLabel`；未登录预览由 `sessionReady` 决定。
 */
import { useI18n } from '~/i18n/use-i18n'
import { formatExchangeBalanceLabel } from '~/views/dapp/exchange/labels'

export function useExchangeBalanceLabels({
  buyBalanceLabel,
  sellBalanceLabel,
  sessionReady,
}: {
  buyBalanceLabel: string
  sellBalanceLabel: string
  sessionReady: boolean
}) {
  const { messages: t } = useI18n()

  const sellLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: sellBalanceLabel,
  })
  const buyLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: buyBalanceLabel,
  })

  return { buyLabel, sellLabel, exchangePreview: !sessionReady }
}
