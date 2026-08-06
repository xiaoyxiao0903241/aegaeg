import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useMakingOverview } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { formatNumber, formatUsdApprox, parseApiAmount } from '~/shared/api/format-display'
import { formatApiAmount, formatApiStatLabel } from '~/views/dapp/rewards/shared'
import { useRewardsContributionDisplay } from '~/views/dapp/rewards/use-rewards-contribution-display'

export type HubStats = {
  totalRewardGagx: string
  totalRewardApprox: string
  tierLabel: string
  /** 机制表高亮行：有 making_rank 跟真实档位；无数据时演示为 A4（index 3） */
  tierRowIndex: number
  personalUsd: string
  personalAgx: string
  makingMarketUsd: string
  makingMarketAgx: string
  smallMarketUsd: string
  smallMarketAgx: string
  contributionValue: string
}

function formatUsdFromAgx(raw: string | null | undefined, priceUsd: number | null): string {
  const n = parseApiAmount(raw)
  if (n == null || priceUsd == null || priceUsd <= 0) {
    return formatNumber(0, { digits: 2, prefix: '$' })
  }
  return formatNumber(n * priceUsd, { digits: 2, prefix: '$' })
}

function formatAgxSecondary(raw: string | null | undefined): string {
  return `${formatApiAmount(raw)} AGX`
}

function formatMakingTierLabel(rank: number | null | undefined, emptyLabel: string): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return emptyLabel
  return `A${Math.trunc(rank)}`
}

/** 档位序号映射：A1→0 … A13→12；无档位演示为 A4（3）；>13 → 终身成就行（13） */
function makingRankToRowIndex(rank: number | null | undefined): number {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return 3
  const n = Math.trunc(rank)
  if (n >= 1 && n <= 13) return n - 1
  return 13
}

/**
 * 奖励 Hub 统计瓦片数据
 *
 * 汇总做市概览（总奖励、档位、持仓、做市额）与贡献快照，
 * 全部金额按 AGX 折算 USD 展示；未登录走空态占位。
 *
 * @see docs/backend-api/api.md #performance/making-overview
 */
export function useHub(): HubStats {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useMakingOverview(sessionReady)
  const { contributionValue } = useRewardsContributionDisplay(walletReady)
  const tierEmpty = t.rewards.hub.stats.tierEmpty
  const overview = overviewQuery.data
  const pending = overviewQuery.isLoading

  const totalRaw = sessionReady ? overview?.total_reward : null
  const totalFinite = parseApiAmount(totalRaw) ?? 0
  const rank = sessionReady ? overview?.making_rank : null

  return {
    totalRewardGagx: `${formatApiStatLabel(sessionReady, pending, totalRaw)} gAGX`,
    totalRewardApprox: formatUsdApprox(totalFinite, sessionReady ? priceUsd : null),
    tierLabel: !sessionReady
      ? tierEmpty
      : pending && overview == null
        ? tierEmpty
        : formatMakingTierLabel(rank, tierEmpty),
    tierRowIndex: makingRankToRowIndex(rank),
    personalUsd: formatUsdFromAgx(sessionReady ? overview?.personal_position : null, priceUsd),
    personalAgx: formatAgxSecondary(sessionReady ? overview?.personal_position : null),
    makingMarketUsd: formatUsdFromAgx(sessionReady ? overview?.making_market : null, priceUsd),
    makingMarketAgx: formatAgxSecondary(sessionReady ? overview?.making_market : null),
    smallMarketUsd: formatUsdFromAgx(sessionReady ? overview?.small_market : null, priceUsd),
    smallMarketAgx: formatAgxSecondary(sessionReady ? overview?.small_market : null),
    contributionValue,
  }
}
