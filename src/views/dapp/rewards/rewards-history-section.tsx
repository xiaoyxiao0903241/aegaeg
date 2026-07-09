import { useEffect, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import {
  useCommunityFundLogs,
  useCommunityFundTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
} from '~/hooks/use-api-data'
import { formatUsd } from '~/shared/api/format-display'
import {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
} from '~/views/dapp/rewards/rewards-display'
import { useAuth } from '~/app/bootstrap/use-auth'
import { DappCollapsibleSection } from '~/app/shell/components/dapp-collapsible-section'
import { DappSection } from '~/app/shell/components/dapp-section'
import { DappTablePagination } from '~/app/shell/components/dapp-table-pagination'
import { DappTableCard } from '~/app/shell/components/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/components/dapp-table-empty-message'
import { DappTableAuthPrompt } from '~/app/shell/components/dapp-table-auth-prompt'
import { ResponsiveTable } from '~/app/shell/components/responsive-table'
import {
  rewardsCommunityFundHistoryColWidths,
  rewardsReferralHistoryColWidths,
  rewardsTeamHistoryColWidths,
} from '~/app/shell/components/dapp-table-columns'
import { dappTableViewState, tablePageQuery } from '~/shared/lib/table-pagination'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import {
  RewardsHistoryPillTabs,
  RewardsHistoryReveal,
} from '~/views/dapp/rewards/rewards-history-primitives'

type RewardsHistoryTab = 'referral' | 'team' | 'communityFund'
type HistoryPillOption = { label: string; value: RewardsHistoryTab }

export function RewardsHistorySection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const [historyTab, setHistoryTab] = useState<RewardsHistoryTab>('referral')
  const [referralPage, setReferralPage] = useState(1)
  const [teamPage, setTeamPage] = useState(1)
  const [communityFundPage, setCommunityFundPage] = useState(1)
  const historyTableScrollRef = useRef<HTMLDivElement>(null)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true

  useEffect(() => {
    historyTableScrollRef.current?.scrollTo({ left: 0, behavior: 'instant' })
  }, [historyTab])

  useEffect(() => {
    if (!isSuperCommunity && historyTab === 'communityFund') {
      setHistoryTab('referral')
    }
  }, [historyTab, isSuperCommunity])

  const {
    data: rewardLogs,
    isLoading: rewardLogsLoading,
    refresh: refreshReferralLogs,
  } = useRewardLogs(tablePageQuery(referralPage), sessionReady)
  const {
    data: teamClaimLogs,
    isLoading: teamClaimLogsLoading,
    refresh: refreshTeamLogs,
  } = useTeamRewardClaimLogs(tablePageQuery(teamPage), sessionReady)
  const {
    data: communityFundLogs,
    isLoading: communityFundLogsLoading,
    refresh: refreshCommunityFundLogs,
  } = useCommunityFundLogs(
    tablePageQuery(communityFundPage),
    sessionReady && isSuperCommunity,
  )

  const historyStatusLabels = t.rewards.logStatus

  const referralHistoryRows =
    rewardLogs?.items.map((item) => mapRewardLogToRow(item, historyStatusLabels)) ?? []
  const teamHistoryRows =
    teamClaimLogs?.items.map((item) => mapTeamRewardClaimLogToRow(item, historyStatusLabels)) ?? []
  const communityFundHistoryRows =
    communityFundLogs?.items.map((item) => mapCommunityFundLogToRow(item, historyStatusLabels)) ??
    []

  const historyRows =
    historyTab === 'referral'
      ? referralHistoryRows
      : historyTab === 'team'
        ? teamHistoryRows
        : communityFundHistoryRows
  const historyTotal =
    historyTab === 'referral'
      ? rewardLogs?.total ?? 0
      : historyTab === 'team'
        ? teamClaimLogs?.total ?? 0
        : communityFundLogs?.total ?? 0
  const historyPage =
    historyTab === 'referral'
      ? referralPage
      : historyTab === 'team'
        ? teamPage
        : communityFundPage
  const onHistoryPageChange =
    historyTab === 'referral'
      ? setReferralPage
      : historyTab === 'team'
        ? setTeamPage
        : setCommunityFundPage
  const historyLoading =
    historyTab === 'referral'
      ? rewardLogsLoading
      : historyTab === 'team'
        ? teamClaimLogsLoading
        : communityFundLogsLoading
  const historyTable = dappTableViewState({
    sessionReady,
    isLoading: historyLoading,
    isLoggingIn,
    rowCount: historyRows.length,
  })
  const historyShowSkeleton = isLoggingIn || historyTable.showSkeleton
  const communityFundPaginationSummary = t.rewards.communityFundCumulativeClaimed.replace(
    '{amount}',
    formatUsd(communityFundTotal?.claimed ?? 0, 2),
  )

  const historyHeaders =
    historyTab === 'referral'
      ? [
          t.tables.time,
          t.tables.amount,
          t.tables.from,
          t.tables.contribution,
          t.tables.status,
        ]
      : historyTab === 'team'
        ? [t.tables.claimTime, t.tables.amount, t.tables.genesisRank, t.tables.status]
        : [t.tables.claimTime, t.tables.amount, t.tables.status]

  const historyColWidths =
    historyTab === 'referral'
      ? [...rewardsReferralHistoryColWidths]
      : historyTab === 'team'
        ? [...rewardsTeamHistoryColWidths]
        : [...rewardsCommunityFundHistoryColWidths]

  const historyPillItems: HistoryPillOption[] = [
    { label: t.rewards.referralRewards, value: 'referral' },
    { label: t.rewards.teamRewards, value: 'team' },
    ...(isSuperCommunity
      ? [{ label: t.rewards.communityFundHistory, value: 'communityFund' as const }]
      : []),
  ]

  const historyPillTabs = (
    <RewardsHistoryPillTabs
      aria-label={t.rewards.history}
      onChange={(value) => {
        const tabs: RewardsHistoryTab[] = isSuperCommunity
          ? ['referral', 'team', 'communityFund']
          : ['referral', 'team']
        const next = tabs.find((tab) => tab === value) ?? 'referral'
        setHistoryTab(next)
        void (
          next === 'referral'
            ? refreshReferralLogs()
            : next === 'team'
              ? refreshTeamLogs()
              : refreshCommunityFundLogs()
        )
      }}
      options={historyPillItems}
      value={historyTab}
    />
  )

  const historyTableBody = historyTable.requiresAuth ? (
    <DappTableAuthPrompt body={t.dapp.connect.recordsBodyRewards} embedded />
  ) : historyTable.queryEmpty ? (
    <>
      <ResponsiveTable
        colWidths={historyColWidths}
        compact
        headers={historyHeaders}
        rows={[]}
      />
      <DappTableEmptyMessage
        body={
          historyTab === 'referral'
            ? t.rewards.referralHistoryEmpty.body
            : historyTab === 'team'
              ? t.rewards.teamHistoryEmpty.body
              : t.rewards.communityFundHistoryEmpty.body
        }
        embedded
        title={
          historyTab === 'referral'
            ? t.rewards.referralHistoryEmpty.title
            : historyTab === 'team'
              ? t.rewards.teamHistoryEmpty.title
              : t.rewards.communityFundHistoryEmpty.title
        }
      />
    </>
  ) : (
    <ResponsiveTable
      colWidths={historyColWidths}
      compact
      headers={historyHeaders}
      isLoading={historyShowSkeleton}
      linkColumns={[1]}
      loadingRowCount={4}
      rows={historyRows}
    />
  )

  const historyTableCard = (
    <DappTableCard
      ref={historyTableScrollRef}
      footer={
        !historyTable.requiresAuth ? (
          <DappTablePagination
            embedded
            onPageChange={onHistoryPageChange}
            page={historyPage}
            summary={historyTab === 'communityFund' ? communityFundPaginationSummary : undefined}
            total={historyTotal}
          />
        ) : undefined
      }
      header={!historyTable.requiresAuth ? historyPillTabs : undefined}
    >
      {historyTableBody}
    </DappTableCard>
  )

  if (isMobileViewport) {
    return (
      <DappSection title={t.rewards.history}>
        <RewardsHistoryReveal>{historyTableCard}</RewardsHistoryReveal>
      </DappSection>
    )
  }

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.rewards.history}>
      <RewardsHistoryReveal>{historyTableCard}</RewardsHistoryReveal>
    </DappCollapsibleSection>
  )
}
