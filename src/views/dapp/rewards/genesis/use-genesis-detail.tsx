import { type ReactNode, useEffect, useState } from 'react'

import { getTeamRequirementLegRank, rewardTierRows } from '~/core/presale/tier-table'
import {
  useCommunityFundLogs,
  useCommunityFundTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
} from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { StatusBadge } from '~/shared/components/badge'
import { Text } from '~/shared/components/text'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import {
  formatPresaleRank,
  formatShareholderHintForRank,
  getPresaleRankHighlightedRows,
} from '~/shared/presenters/format'
import {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  NON_NUMERIC_EMPTY,
} from '~/views/dapp/rewards/shared'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank-labels'

type GenesisHistoryTab = 'referral' | 'team' | 'communityFund'

function formatGenesisTierTeamCell(
  rankLabel: string,
  totalVolumeValue: string,
  tierDualLegRequirement: string,
): string {
  const rank = Number.parseInt(rankLabel.replace(/^S/i, ''), 10)
  const legRank = getTeamRequirementLegRank(rank)
  if (legRank == null) return totalVolumeValue
  return interpolate(tierDualLegRequirement, { rank: formatPresaleRank(legRank) })
}

/** 历史记录金额统一加 +$ 前缀，突出发放 */
function withSignedUsdPrefix(amount: string): string {
  if (!amount || amount === NON_NUMERIC_EMPTY) return amount
  if (amount.startsWith('+') || amount.startsWith('-')) return amount
  return `+${amount}`
}

/**
 * 创世荣誉详情视图模型
 *
 * 聚合股东等级、社区基金节点状态与三类历史记录
 * （推荐 / 团队 / 社区基金），生成荣誉档位表与分页历史。
 *
 * @see docs/backend-api/api.md #community-fund/total
 */
export function useRewardsGenesisDetail() {
  const { messages: t } = useI18n()
  const g = t.rewards.genesisDetail
  const { sessionReady } = useDappHost()
  const { displayRank, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true
  const hasRank = displayRank > 0
  const [historyTab, setHistoryTab] = useState<GenesisHistoryTab>('referral')
  const [historyPage, setHistoryPage] = useState(1)

  useEffect(() => {
    setHistoryPage(1)
  }, [historyTab])

  const pageParams = tablePageQuery(historyPage)
  const { data: rewardLogs, isLoading: rewardLogsLoading } = useRewardLogs(
    pageParams,
    sessionReady && historyTab === 'referral',
  )
  const { data: teamClaimLogs, isLoading: teamLogsLoading } = useTeamRewardClaimLogs(
    pageParams,
    sessionReady && historyTab === 'team',
  )
  const { data: communityFundLogs, isLoading: communityLogsLoading } = useCommunityFundLogs(
    pageParams,
    sessionReady && isSuperCommunity && historyTab === 'communityFund',
  )

  const heroBody = hasRank
    ? formatShareholderHintForRank(
        displayRank,
        t.rewards.heroTierRewardBody,
        t.rewards.shareholderNoRankBody,
        rewardTierRows(),
      )
    : t.rewards.shareholderNoRankBody

  const rewardTiers = rewardTierRows()
  const highlightedRows = getPresaleRankHighlightedRows(displayRank, rewardTiers.length)
  /** 当前档：显示「当前」标签（与 Hub 机制表一致） */
  const tierRows: ReactNode[][] = rewardTiers.map((row, rowIndex) => {
    const rankLabel = row[0] ?? ''
    const personal = row[1] ?? ''
    const team = formatGenesisTierTeamCell(
      rankLabel,
      row[2] ?? '',
      t.rewards.tierDualLegRequirement,
    )
    const rate = row[3] ?? ''
    const isCurrent = highlightedRows.includes(rowIndex)
    const levelCell = isCurrent ? (
      <span className="inline-flex items-center gap-2">
        <Text as="span" className="font-semibold" variant="copy">
          {rankLabel}
        </Text>
        <StatusBadge className="font-semibold text-coral" size="compact" tone="pending">
          {t.rewards.currentTierSuffix}
        </StatusBadge>
      </span>
    ) : (
      rankLabel
    )
    return [levelCell, personal, team, rate]
  })

  const historyStatusLabels = t.rewards.logStatus
  const typeReferral = t.rewards.rewardType.referralPaid
  const typeTeam = t.rewards.rewardType.presaleTeam
  const typeFund = t.rewards.communityFund

  const activeHistory =
    historyTab === 'referral'
      ? rewardLogs
      : historyTab === 'team'
        ? teamClaimLogs
        : communityFundLogs

  const historyRows: ReactNode[][] =
    historyTab === 'referral'
      ? (rewardLogs?.items.map((item) => {
          const mapped = mapRewardLogToRow(item, historyStatusLabels)
          const amountLabel = mapped[1]
          return [
            mapped[0] ?? NON_NUMERIC_EMPTY,
            typeReferral,
            withSignedUsdPrefix(typeof amountLabel === 'string' ? amountLabel : NON_NUMERIC_EMPTY),
            <Text as="span" className="font-semibold text-foreground/40" key="st" variant="support">
              {mapped[4] ?? NON_NUMERIC_EMPTY}
            </Text>,
          ]
        }) ?? [])
      : historyTab === 'team'
        ? (teamClaimLogs?.items.map((item) => {
            const mapped = mapTeamRewardClaimLogToRow(item, historyStatusLabels)
            return [
              mapped[0] ?? NON_NUMERIC_EMPTY,
              typeTeam,
              withSignedUsdPrefix(mapped[1] ?? NON_NUMERIC_EMPTY),
              <Text
                as="span"
                className="font-semibold text-foreground/40"
                key="st"
                variant="support"
              >
                {mapped[3] ?? NON_NUMERIC_EMPTY}
              </Text>,
            ]
          }) ?? [])
        : (communityFundLogs?.items.map((item) => {
            const mapped = mapCommunityFundLogToRow(item, historyStatusLabels)
            return [
              mapped[0] ?? NON_NUMERIC_EMPTY,
              typeFund,
              withSignedUsdPrefix(mapped[1] ?? NON_NUMERIC_EMPTY),
              <Text
                as="span"
                className="font-semibold text-foreground/40"
                key="st"
                variant="support"
              >
                {mapped[2] ?? NON_NUMERIC_EMPTY}
              </Text>,
            ]
          }) ?? [])

  const historyLoading =
    historyTab === 'referral'
      ? rewardLogsLoading
      : historyTab === 'team'
        ? teamLogsLoading
        : communityLogsLoading

  const historyEmpty =
    historyTab === 'referral'
      ? t.rewards.referralHistoryEmpty
      : historyTab === 'team'
        ? t.rewards.teamHistoryEmpty
        : t.rewards.communityFundHistoryEmpty

  const historyTabOptions: Array<{ label: string; value: GenesisHistoryTab }> = [
    { label: t.rewards.referralRewards, value: 'referral' },
    { label: t.rewards.teamRewards, value: 'team' },
    { label: t.rewards.communityFundHistory, value: 'communityFund' },
  ]

  const showHeroSkeleton = sessionReady && isRankLoading

  return {
    t,
    g,
    sessionReady,
    heroTitle,
    hasRank,
    isSuperCommunity,
    showHeroSkeleton,
    heroBody,
    highlightedRows,
    tierRows,
    historyTab,
    setHistoryTab,
    historyTabOptions,
    historyRows,
    historyLoading,
    historyEmpty,
    historyPage,
    setHistoryPage,
    historyTotal: activeHistory?.total ?? 0,
  }
}
