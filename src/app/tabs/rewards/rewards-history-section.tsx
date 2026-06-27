import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { useRewardLogs, useTeamRewardClaimLogs } from '~/hooks/use-api-data'
import { mapRewardLogToRow, mapTeamRewardClaimLogToRow } from '~/lib/api/format-display'
import { useAuth } from '~/providers/auth-provider'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableCard } from '~/app/components/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableAuthPrompt } from '~/app/components/dapp-table-auth-prompt'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

export function RewardsHistorySection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const [historyTab, setHistoryTab] = useState<'referral' | 'team'>('referral')
  const [referralPage, setReferralPage] = useState(1)
  const [teamPage, setTeamPage] = useState(1)
  const historyTableScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    historyTableScrollRef.current?.scrollTo({ left: 0, behavior: 'instant' })
  }, [historyTab])

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
  const historyRows = historyTab === 'referral' ? referralHistoryRows : teamHistoryRows
  const historyTotal =
    historyTab === 'referral' ? rewardLogs?.total ?? 0 : teamClaimLogs?.total ?? 0
  const historyPage = historyTab === 'referral' ? referralPage : teamPage
  const onHistoryPageChange = historyTab === 'referral' ? setReferralPage : setTeamPage
  const historyLoading = historyTab === 'referral' ? rewardLogsLoading : teamClaimLogsLoading
  const historyTable = dappTableViewState({
    sessionReady,
    isLoading: historyLoading,
    isLoggingIn,
    rowCount: historyRows.length,
  })
  const historyShowSkeleton = isLoggingIn || historyTable.showSkeleton

  const historyHeaders =
    historyTab === 'referral'
      ? [
          t.tables.time,
          t.tables.amount,
          t.tables.from,
          t.tables.contribution,
          t.tables.status,
        ]
      : [t.tables.claimTime, t.tables.amount, t.tables.genesisRank, t.tables.status]

  const historyColWidths =
    historyTab === 'referral'
      ? ['132px', '104px', '140px', '120px', '104px']
      : ['160px', '120px', '160px', '160px']

  const historyPillTabs = (
    <DappPillTabs
      ariaLabel={t.rewards.history}
      className="flex items-center justify-start gap-2"
      items={[
        { active: historyTab === 'referral', label: t.rewards.referralRewards },
        { active: historyTab === 'team', label: t.rewards.teamRewards },
      ]}
      onSelect={(index) => {
        const next = index === 0 ? 'referral' : 'team'
        setHistoryTab(next)
        void (next === 'referral' ? refreshReferralLogs() : refreshTeamLogs())
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
            : t.rewards.teamHistoryEmpty.body
        }
        embedded
        title={
          historyTab === 'referral'
            ? t.rewards.referralHistoryEmpty.title
            : t.rewards.teamHistoryEmpty.title
        }
      />
    </>
  ) : (
    <ResponsiveTable
      colWidths={historyColWidths}
      compact
      headers={historyHeaders}
      isLoading={historyShowSkeleton}
      loadingRowCount={4}
      positiveColumns={[1]}
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
