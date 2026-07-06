import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import {
  useCommunityFundLogs,
  useCommunityFundTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
} from '~/hooks/use-api-data'
import {
  formatUsd,
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
} from '~/lib/api/format-display'
import { useAuth } from '~/providers/auth-provider'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableCard } from '~/app/components/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableAuthPrompt } from '~/app/components/dapp-table-auth-prompt'
import { ResponsiveTable } from '~/app/components/responsive-table'
import {
  rewardsCommunityFundHistoryColWidths,
  rewardsReferralHistoryColWidths,
  rewardsTeamHistoryColWidths,
} from '~/app/components/dapp-table-shell'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

type RewardsHistoryTab = 'referral' | 'team' | 'communityFund'

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

  const rewardLogLabels = useMemo(
    () => ({
      rewardType: t.rewards.rewardType,
      logStatus: t.rewards.logStatus,
    }),
    [t.rewards.logStatus, t.rewards.rewardType],
  )
  const teamHistoryLabels = useMemo(
    () => ({
      logStatus: t.rewards.logStatus,
    }),
    [t.rewards.logStatus],
  )

  const referralHistoryRows =
    rewardLogs?.items.map((item) => mapRewardLogToRow(item, rewardLogLabels)) ?? []
  const teamHistoryRows =
    teamClaimLogs?.items.map((item) => mapTeamRewardClaimLogToRow(item, teamHistoryLabels)) ?? []
  const communityFundHistoryRows =
    communityFundLogs?.items.map((item) => mapCommunityFundLogToRow(item, teamHistoryLabels)) ??
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

  const historyPillItems = [
    { active: historyTab === 'referral', label: t.rewards.referralRewards },
    { active: historyTab === 'team', label: t.rewards.teamRewards },
    ...(isSuperCommunity
      ? [{ active: historyTab === 'communityFund', label: t.rewards.communityFundHistory }]
      : []),
  ]

  const historyPillTabs = (
    <DappPillTabs
      ariaLabel={t.rewards.history}
      className="flex items-center justify-start gap-2"
      items={historyPillItems}
      onSelect={(index) => {
        const tabs: RewardsHistoryTab[] = isSuperCommunity
          ? ['referral', 'team', 'communityFund']
          : ['referral', 'team']
        const next = tabs[index] ?? 'referral'
        setHistoryTab(next)
        void (
          next === 'referral'
            ? refreshReferralLogs()
            : next === 'team'
              ? refreshTeamLogs()
              : refreshCommunityFundLogs()
        )
      }}
    />
  )

  const historyTableBody = historyTable.requiresAuth ? (
    <DappTableAuthPrompt body={t.dapp.connect.recordsBodyRewards} embedded />
  ) : historyTable.queryEmpty ? (
    <>
      <ResponsiveTable colWidths={historyColWidths} compact headers={historyHeaders} rows={[]} />
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
        <div className={revealClass()} data-reveal>
          {historyTableCard}
        </div>
      </DappSection>
    )
  }

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.rewards.history}>
      <div className={revealClass()} data-reveal>
        {historyTableCard}
      </div>
    </DappCollapsibleSection>
  )
}
