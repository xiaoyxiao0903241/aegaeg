import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { usePerformance, useTeamReferrals } from '~/hooks/use-api-data'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import {
  formatPresaleRank,
  formatUsd,
  mapTeamReferralToCompactRow,
  mapTeamReferralToMobileRow,
} from '~/lib/api/format-display'
import { CommunityStatCardSkeleton } from '~/app/components/dapp-skeleton'
import { useAuth } from '~/providers/auth-provider'
import { useReferral } from '~/hooks/use-referral'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import type { DappTab } from '~/app/types'
import { CommunityStatCard } from '~/app/components/dapp-card'
import { DappSection } from '~/app/components/dapp-section'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableEmptyState } from '~/app/components/dapp-table-empty-state'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { CommunityFaqSection } from '~/app/tabs/community/community-faq-section'
import { CommunityFlowSection } from '~/app/tabs/community/community-flow-section'
import {
  COMMUNITY_STAT_GRID,
  type CommunityStat,
} from '~/app/tabs/community/community-shared'

export function CommunityContent({
  onSelectTab,
}: {
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady, tab } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const referralChain = useReferral(sessionReady)
  const [invitesPage, setInvitesPage] = useState(1)
  const { data: performance, isLoading: performanceLoading } = usePerformance(sessionReady)
  const { displayRank, isRankLoading } = useShareholderRank()
  const { data: referrals, isLoading: referralsLoading } = useTeamReferrals(
    tablePageQuery(invitesPage),
    sessionReady,
  )

  const inviteRowsCompact =
    referrals?.items.map((item) =>
      isMobileViewport ? mapTeamReferralToMobileRow(item) : mapTeamReferralToCompactRow(item),
    ) ?? []
  const compactRows = inviteRowsCompact
  const invitesTotal = referrals?.total ?? 0
  const invitesTable = dappTableViewState({
    sessionReady,
    isLoading: referralsLoading,
    isLoggingIn,
    rowCount: compactRows.length,
  })
  const inviteCount = !sessionReady
    ? '0'
    : referralsLoading || isLoggingIn
      ? '…'
      : String(referrals?.total ?? Number(referralChain.directCount || 0))
  const inviteSectionTitle = t.community.myInvites.replace('{count}', inviteCount)
  const authPending = sessionReady && isLoggingIn

  if (!sessionReady) {
    return (
      <DappDetailPage className="max-dapp:pb-20">
        <CommunityFlowSection isMobileViewport={isMobileViewport} onSelectTab={onSelectTab} />
        <CommunityFaqSection />
      </DappDetailPage>
    )
  }

  const useStatPlaceholders =
    authPending ||
    performanceLoading ||
    referralsLoading ||
    referralChain.isLoading ||
    isRankLoading

  const directCount = referralChain.directCount
  const directVolume = formatUsd(performance?.direct_presale_volume ?? 0)

  const teamCount = String(referrals?.total ?? referralChain.directCount)
  const teamVolume = formatUsd(performance?.sales_team_market ?? 0)

  const shareholderRank = formatPresaleRank(displayRank)
  const genesisShareholderLabel = useStatPlaceholders || isRankLoading
    ? t.community.statGenesisVolume
    : displayRank > 0
      ? t.community.genesisShareholder
      : t.rewards.shareholderHintNoRank

  const stats: CommunityStat[] = [
    {
      label: t.community.directReferrals,
      value: directCount,
      volume: useStatPlaceholders ? (
        t.community.statDirectVolume
      ) : (
        `${t.community.volumePrefix} ${directVolume}`
      ),
      today: t.community.statDirectToday,
    },
    {
      label: t.community.myTeam,
      value: teamCount,
      volume: useStatPlaceholders ? (
        t.community.statTeamVolume
      ) : (
        `${t.community.volumePrefix} ${teamVolume}`
      ),
      today: t.community.statTeamToday,
    },
    {
      label: t.community.genesisTitle,
      value: shareholderRank,
      volume: genesisShareholderLabel,
      today: t.community.statGenesisToday,
      dark: !isMobileViewport,
    },
  ]

  return (
    <DappDetailPage>
      <DappContentHeading id="community-title" reveal>
        {t.community.myCommunity}
      </DappContentHeading>

      <div className={COMMUNITY_STAT_GRID}>
        {useStatPlaceholders ? (
          <>
            <CommunityStatCardSkeleton />
            <CommunityStatCardSkeleton />
            <CommunityStatCardSkeleton dark />
          </>
        ) : (
          stats.map((stat, index) => (
            <CommunityStatCard
              className={cn(
                isMobileViewport &&
                  'items-center text-center shadow-card [&>b]:hidden [&>small]:hidden [&>span]:text-[11px] [&>span]:tracking-[-0.11px] [&>strong]:text-lg [&>strong]:tracking-[-0.54px]',
              )}
              dark={stat.dark}
              image={stat.image}
              key={index}
              label={stat.label}
              today={stat.today}
              value={stat.value}
              volume={stat.volume}
            />
          ))
        )}
      </div>

      <CommunityFlowSection
        sessionReady={sessionReady}
        isMobileViewport={isMobileViewport}
        onSelectTab={onSelectTab}
        tab={tab}
      />

      <DappSection
        className="group-data-[tab=community]/shell:max-dapp:mt-0"
        title={inviteSectionTitle}
      >
        {invitesTable.requiresAuth ? (
          <DappTableEmptyState className="mt-3.5" />
        ) : invitesTable.queryEmpty ? (
          <DappTableEmptyMessage
            body={t.community.invitesEmpty.body}
            className="mt-3.5"
            title={t.community.invitesEmpty.title}
          />
        ) : (
          <>
            <ResponsiveTable
              className={cn(
                'mt-3.5 max-dapp:mt-3 max-dapp:rounded-2xl max-dapp:shadow-card',
                !isMobileViewport && [
                  '[&_table]:table-fixed',
                  '[&_th:nth-child(1)]:w-[23.08%] [&_td:nth-child(1)]:w-[23.08%]',
                  '[&_th:nth-child(2)]:w-[30.77%] [&_td:nth-child(2)]:w-[30.77%]',
                  '[&_th:nth-child(3)]:w-[15.38%] [&_td:nth-child(3)]:w-[15.38%]',
                  '[&_th:nth-child(4)]:w-[15.38%] [&_td:nth-child(4)]:w-[15.38%]',
                  '[&_th:nth-child(5)]:w-[15.38%] [&_td:nth-child(5)]:w-[15.38%]',
                ],
              )}
              compact
              emphasisColumns={isMobileViewport ? [] : [3]}
              headers={
                isMobileViewport
                  ? [
                      t.tables.joined,
                      t.tables.address,
                      t.tables.title,
                      t.tables.volume,
                    ]
                  : [
                      t.tables.joined,
                      t.tables.address,
                      t.tables.title,
                      t.tables.direct,
                      t.tables.volume,
                    ]
              }
              isLoading={invitesTable.showSkeleton}
              linkColumns={[1]}
              plain
              rows={compactRows}
            />
            <DappTablePagination
              onPageChange={setInvitesPage}
              page={invitesPage}
              total={invitesTotal}
            />
          </>
        )}
      </DappSection>

      <CommunityFaqSection />
    </DappDetailPage>
  )
}
