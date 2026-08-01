import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatApproxUsd } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { AssetsProduct } from '~/views/dapp/assets/position/use-assets-position-queries'
import { useAssetsPositionQueries } from '~/views/dapp/assets/position/use-assets-position-queries'
import { useAgxPriceUsd } from '~/views/dapp/assets/use-agx-price-usd'
import { useActiveAccount } from '~/web3/thirdweb-react'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type AssetsPositionStatCell = {
  value: string
  approx?: string
  icon?: 'agx' | 'gagx'
}

type PricedStat = {
  amount: bigint
  decimals: number
  unit: 'AGX' | 'gAGX'
  icon: NonNullable<AssetsPositionStatCell['icon']>
}

function mapPricedStats(
  rows: readonly PricedStat[],
  priceUsd: number | null,
): AssetsPositionStatCell[] {
  return rows.map(({ amount, decimals, unit, icon }) => ({
    value: `${formatTokenAmount(amount, decimals, 2)} ${unit}`,
    icon,
    approx: formatApproxUsd(formatTokenAmountToNumber(amount, decimals), priceUsd),
  }))
}

/** Right-rail position stats — aggregates existing assets reads (38 §4, no fake numbers). */
export function useAssetsPositionStats(product: AssetsProduct): AssetsPositionStatCell[] {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const address = account?.address
  const priceUsd = useAgxPriceUsd()
  const { stakeQuery, bondQuery } = useAssetsPositionQueries(product)

  if (!walletReady || !address) {
    return Array.from({ length: product === 'stake' ? 6 : 5 }, () => ({
      value: '0.00 AGX',
      approx: formatApproxUsd(0, null),
    }))
  }

  if (product === 'stake') {
    if (stakeQuery.isError) {
      return Array.from({ length: 6 }, () => ({
        value: '0.00 AGX',
        approx: formatApproxUsd(0, null),
      }))
    }
    if (stakeQuery.data === undefined) {
      return Array.from({ length: 6 }, () => ({
        value: '0.00 AGX',
        approx: formatApproxUsd(0, null),
      }))
    }
    const rows = stakeQuery.data
    const total = rows.reduce((sum, row) => sum + row.principal, 0n)
    const released = rows.reduce((sum, row) => sum + row.releasedPrincipal, 0n)
    const pendingRelease = rows.reduce((sum, row) => {
      const left =
        row.principal > row.releasedPrincipal ? row.principal - row.releasedPrincipal : 0n
      return sum + left
    }, 0n)
    const rebaseReward = rows.reduce((sum, row) => sum + row.blockReward, 0n)
    const rebaseBonus = rows.reduce((sum, row) => sum + row.extraInterest, 0n)
    // 质押总收益 = 未领 Rebase 收益 + 加成（gAGX）；不含 claimableBalance（AGX 本金）
    const totalYield = rebaseReward + rebaseBonus
    return mapPricedStats(
      [
        { amount: total, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: released, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: pendingRelease, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: rebaseReward, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
        { amount: rebaseBonus, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
        { amount: totalYield, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
      ],
      priceUsd,
    )
  }

  // LP `4518:5993` / Burn `4518:6384`: 我的持仓 / 已释放 / 待释放 / 当前Rebase / 总收益(无累计 → 0)
  if (bondQuery.isError) {
    return Array.from({ length: 5 }, () => ({
      value: '0.00 AGX',
      approx: formatApproxUsd(0, null),
    }))
  }
  if (bondQuery.data === undefined) {
    return Array.from({ length: 5 }, () => ({
      value: '0.00 AGX',
      approx: formatApproxUsd(0, null),
    }))
  }

  const rows = bondQuery.data
  const total = rows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const released = rows.reduce((sum, row) => sum + row.pendingPayout, 0n)
  const pendingRelease = rows.reduce((sum, row) => {
    const left =
      row.payoutRemaining > row.pendingPayout ? row.payoutRemaining - row.pendingPayout : 0n
    return sum + left
  }, 0n)
  const profit = rows.reduce((sum, row) => sum + row.profit, 0n)

  return [
    ...mapPricedStats(
      [
        { amount: total, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: released, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: pendingRelease, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: profit, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
      ],
      priceUsd,
    ),
    { value: '0.00 gAGX', icon: 'gagx', approx: formatApproxUsd(0, null) },
  ]
}
