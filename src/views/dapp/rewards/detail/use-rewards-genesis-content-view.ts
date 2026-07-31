import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { buildRewardTierRows, getTeamRequirementLegRank } from '~/core/presale/tier-table'
import {
  formatPresaleRank,
  formatShareholderHintForRank,
  getPresaleRankHighlightedRows,
} from '~/shared/api/format-display'
import {
  useCommunityFundLogs,
  useCommunityFundTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
} from '~/hooks/use-api-data'
import {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  REWARDS_DASH,
} from '~/views/dapp/rewards/rewards-display'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'

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

export function useRewardsGenesisContentView() {
  const { messages: t } = useI18n()
  const g = t.rewards.genesisDetail
  const { sessionReady } = useDappShell()
  const { displayRank, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true
  const hasRank = displayRank > 0
  const [historyTab, setHistoryTab] = useState<GenesisHistoryTab>('referral')

  const { data: rewardLogs, isLoading: rewardLogsLoading } = useRewardLogs(
    { page: 1, page_size: 20 },
    sessionReady,
  )
  const { data: teamClaimLogs, isLoading: teamLogsLoading } = useTeamRewardClaimLogs(
    { page: 1, page_size: 20 },
    sessionReady,
  )
  const { data: communityFundLogs, isLoading: communityLogsLoading } = useCommunityFundLogs(
    { page: 1, page_size: 20 },
    sessionReady && isSuperCommunity,
  )

  const heroBody = hasRank
    ? formatShareholderHintForRank(
        displayRank,
        t.rewards.heroTierRewardBody,
        t.rewards.shareholderNoRankBody,
        buildRewardTierRows(),
      )
    : t.rewards.shareholderNoRankBody

  const rewardTiers = buildRewardTierRows()
  const highlightedRows = getPresaleRankHighlightedRows(displayRank, rewardTiers.length)
  const tierRows = rewardTiers.map((row, rowIndex) => {
    const rankLabel = row[0] ?? ''
    const personal = row[1] ?? ''
    const team = formatGenesisTierTeamCell(
      rankLabel,
      row[2] ?? '',
      t.rewards.tierDualLegRequirement,
    )
    const rate = row[3] ?? ''
    const levelCell = highlightedRows.includes(rowIndex)
      ? `${rankLabel} · ${t.rewards.currentTierSuffix}`
      : rankLabel
    return [levelCell, personal, team, rate]
  })

  const historyStatusLabels = t.rewards.logStatus
  const typeReferral = t.rewards.rewardType.referralPaid
  const typeTeam = t.rewards.rewardType.presaleTeam
  const typeFund = t.rewards.communityFund

  const historyRows =
    historyTab === 'referral'
      ? (rewardLogs?.items.map((item) => {
          const mapped = mapRewardLogToRow(item, historyStatusLabels)
          return [
            mapped[0] ?? REWARDS_DASH,
            typeReferral,
            mapped[1] ?? REWARDS_DASH,
            mapped[4] ?? REWARDS_DASH,
          ]
        }) ?? [])
      : historyTab === 'team'
        ? (teamClaimLogs?.items.map((item) => {
            const mapped = mapTeamRewardClaimLogToRow(item, historyStatusLabels)
            return [
              mapped[0] ?? REWARDS_DASH,
              typeTeam,
              mapped[1] ?? REWARDS_DASH,
              mapped[3] ?? REWARDS_DASH,
            ]
          }) ?? [])
        : (communityFundLogs?.items.map((item) => {
            const mapped = mapCommunityFundLogToRow(item, historyStatusLabels)
            return [
              mapped[0] ?? REWARDS_DASH,
              typeFund,
              mapped[1] ?? REWARDS_DASH,
              mapped[2] ?? REWARDS_DASH,
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
  }
}
