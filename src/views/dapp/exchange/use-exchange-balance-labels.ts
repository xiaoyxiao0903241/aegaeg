/**
 * 兑换买卖两侧的余额标签 hook
 *
 * 按会话与钱包就绪状态统一生成余额和「未就绪预览」提示。
 */
import { useI18n } from '~/i18n/use-i18n'
import { formatExchangeBalanceLabel } from '~/views/dapp/exchange/labels'

export function useExchangeBalanceLabels({
  buyBalanceLabel,
  sellBalanceLabel,
  sessionReady,
  walletReady,
}: {
  buyBalanceLabel: string
  sellBalanceLabel: string
  sessionReady: boolean
  walletReady: boolean
}) {
  const { messages: t } = useI18n()

  const sellLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: sellBalanceLabel,
    sessionReady,
    walletReady,
  })
  const buyLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: buyBalanceLabel,
    sessionReady,
    walletReady,
  })

  return { buyLabel, sellLabel, exchangePreview: !sessionReady }
}
