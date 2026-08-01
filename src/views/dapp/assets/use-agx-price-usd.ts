import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

/** AGX spot in USD1 units for assets approx labels; null when unavailable. */
export function useAgxPriceUsd(): number | null {
  const agxPriceQuery = usePresaleAgxPriceQuery()
  if (agxPriceQuery.isError || agxPriceQuery.data === undefined) return null
  return formatTokenAmountToNumber(agxPriceQuery.data, USD1_DECIMALS)
}
