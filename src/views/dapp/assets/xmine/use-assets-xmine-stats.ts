import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainQuery } from '~/hooks/use-chain-query'
import { formatApproxUsd } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { readXminePosition } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type AssetsXmineStatCell = {
  value: string
  approx?: string
  icon?: 'gagx' | 'x'
}

/** X 挖矿右侧统计：仅读取链上仓位；累计产出暂无数据来源 */
export function useAssetsXmineStats(): AssetsXmineStatCell[] {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const address = account?.address
  const priceUsd = useAgxPriceUsd()

  const positionQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
  })

  if (!walletReady || !address || positionQuery.isError) {
    return Array.from({ length: 4 }, () => ({
      value: '0.00 gAGX',
      approx: formatApproxUsd(0, null),
    }))
  }
  if (positionQuery.data === undefined) {
    return Array.from({ length: 4 }, () => ({
      value: '0.00 gAGX',
      approx: formatApproxUsd(0, null),
    }))
  }

  const { miningStake, pending, warmupGons } = positionQuery.data
  // 无份额转金额的接口，可赎回估算为 warmup 结束后的全部质押，否则为 0
  const released = warmupGons > 0n ? 0n : miningStake

  return [
    ...(
      [
        {
          amount: miningStake,
          decimals: GAGX_DECIMALS,
          unit: 'gAGX',
          icon: 'gagx' as const,
          price: priceUsd,
        },
        {
          amount: released,
          decimals: GAGX_DECIMALS,
          unit: 'gAGX',
          icon: 'gagx' as const,
          price: priceUsd,
        },
        { amount: pending, decimals: X_DECIMALS, unit: 'X', icon: 'x' as const, price: null },
      ] as const
    ).map(({ amount, decimals, unit, icon, price }) => ({
      value: `${formatTokenAmount(amount, decimals, 2)} ${unit}`,
      icon,
      approx: formatApproxUsd(formatTokenAmountToNumber(amount, decimals), price),
    })),
    { value: '0.00 X', icon: 'x', approx: formatApproxUsd(0, null) },
  ]
}
