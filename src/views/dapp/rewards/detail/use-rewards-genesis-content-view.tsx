import { type ReactNode, useEffect, useState } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { getTeamRequirementLegRank, rewardTierRows } from '~/core/presale/tier-table'
import {
  useCommunityFundLogs,
  useCommunityFundTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import {
  formatPresaleRank,
  formatShareholderHintForRank,
  getPresaleRankHighlightedRows,
} from '~/shared/api/format-display'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { Text } from '~/shared/ui/text'
import {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  NON_NUMERIC_EMPTY,
} from '~/views/dapp/rewards/rewards-display'
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
  return tierDualLegRequirement.replace('{rank}', formatPresaleRank(legRank))
}

/** 稿 4414:359 金额 +$ · 强调 */
function withSignedUsdPrefix(amount: string): string {
  if (!amount || amount === NON_NUMERIC_EMPTY) return amount
  if (amount.startsWith('+') || amount.startsWith('-')) return amount
  return `+${amount}`
}

export function useRewardsGenesisContentView() {
  const { messages: t } = useI18n()
  const g = t.rewards.genesisDetail
  const { sessionReady } = useDappShell()
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
  /** Figma 4414:270：等级 semibold + coral-soft「当前」pill（复用 Hub 模式） */
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
        <span className="inline-flex items-center rounded-full bg-primary-soft px-2 py-0.5">
          <Text as="span" className="leading-none font-semibold text-coral" variant="caption">
            {t.rewards.currentTierSuffix}
          </Text>
        </span>
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
          return [
            mapped[0] ?? NON_NUMERIC_EMPTY,
            typeReferral,
            withSignedUsdPrefix(mapped[1] ?? NON_NUMERIC_EMPTY),
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
