import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatNumber } from '~/shared/presenters/format-display'

/** 仓位卡金额：AGX 单位文案，或 Quote=USD 时用缓存价换算 `$1,300.00`。 */
export function formatAssetsPositionAmount(
  amount: bigint,
  decimals: number,
  quote: 'agx' | 'usd',
  priceUsd: number | null,
  unit: 'AGX' | 'gAGX',
): string {
  if (quote === 'usd') {
    if (priceUsd == null || priceUsd <= 0) return '$0.00'
    return formatNumber(formatTokenAmountToNumber(amount, decimals) * priceUsd, {
      digits: 2,
      prefix: '$',
    })
  }
  return `${formatTokenAmount(amount, decimals, 2)} ${unit}`
}
