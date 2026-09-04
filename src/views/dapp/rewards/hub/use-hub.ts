import { PERSONAL_TOKEN_DIGITS } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useMakingOverview } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { cobuildTierDecoSrc, dappAssets } from '~/shared/assets/dapp'
import {
  formatDecimal,
  formatMakingRankLabel,
  makingRankDisplayRank,
  parseApiAmount,
  toUsd,
} from '~/shared/presenters/format'
import { formatApiAmount, formatApiStatLabel } from '~/views/dapp/rewards/shared'
import { useRewardsContribution } from '~/views/dapp/rewards/use-rewards-contribution'

export type HubStats = {
  totalRewardGagx: string
  totalRewardApprox: string
  tierLabel: string
  /** 机制表高亮行：有 making_rank 才高亮；无档 / 未就绪 → null（不高亮） */
  tierRowIndex: number | null
  /** 共建级别卡角色装饰。 */
  tierDecoSrc: string
  personalUsd: string
  personalAgx: string
  makingMarketUsd: string
  makingMarketAgx: string
  smallMarketUsd: string
  smallMarketAgx: string
  contributionValue: string
}

function formatUsdFromAgx(raw: string | null | undefined, priceUsd: number | null): string {
  return formatDecimal(toUsd(parseApiAmount(raw), priceUsd), { digits: 2, prefix: '$' })
}

function formatAgxSecondary(raw: string | null | undefined): string {
  return formatApiAmount(raw, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' AGX' })
}

/** 档位序号：A1→0 … A13→12；>13 → 终身成就行（13）；无档 → null（不高亮） */
function makingRankToRowIndex(rank: number | null | undefined): number | null {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return null
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
export function useRewardsHub(): HubStats {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useMakingOverview(sessionReady)
  const { contributionValue } = useRewardsContribution()
  const tierEmpty = t.rewards.hub.stats.tierEmpty
  const overview = overviewQuery.data
  const pending = overviewQuery.isLoading

  const totalRaw = sessionReady ? overview?.total_reward : null
  const rank = sessionReady ? makingRankDisplayRank(overview?.making_rank, overview) : null

  return {
    totalRewardGagx: formatApiStatLabel(sessionReady, pending, totalRaw, { suffix: ' gAGX' }),
    totalRewardApprox: formatDecimal(toUsd(parseApiAmount(totalRaw), priceUsd), {
      digits: 2,
      prefix: '≈ $',
    }),
    tierLabel: !sessionReady
      ? tierEmpty
      : pending && overview == null
        ? tierEmpty
        : formatMakingRankLabel(rank, tierEmpty, overview),
    tierRowIndex: makingRankToRowIndex(rank),
    tierDecoSrc: cobuildTierDecoSrc(rank, dappAssets.rewardsHubTierDeco),
    personalUsd: formatUsdFromAgx(sessionReady ? overview?.personal_position : null, priceUsd),
    personalAgx: formatAgxSecondary(sessionReady ? overview?.personal_position : null),
    makingMarketUsd: formatUsdFromAgx(sessionReady ? overview?.making_market : null, priceUsd),
    makingMarketAgx: formatAgxSecondary(sessionReady ? overview?.making_market : null),
    smallMarketUsd: formatUsdFromAgx(sessionReady ? overview?.small_market : null, priceUsd),
    smallMarketAgx: formatAgxSecondary(sessionReady ? overview?.small_market : null),
    contributionValue,
  }
}
