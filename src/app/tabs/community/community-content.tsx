import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { useTeamOverview, useTeamReferrals } from '~/hooks/use-api-data'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import {
  formatCount,
  formatPresaleRank,
  formatUsd,
  mapTeamReferralToCompactRow,
} from '~/lib/api/format-display'
import { applyMessageTemplate } from '~/lib/presale/genesis-promo'
import { CommunityStatCardSkeleton } from '~/app/components/dapp-skeleton'
import { useAuth } from '~/providers/auth-provider'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import type { DappTab } from '~/app/types'
import { CommunityStatCard } from '~/app/components/dapp-card'
import { DappSection } from '~/app/components/dapp-section'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableAuthPrompt } from '~/app/components/dapp-table-auth-prompt'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableCard } from '~/app/components/dapp-table-card'
import { communityInviteTableClass } from '~/app/components/dapp-table-shell'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { CommunityFaqSection } from '~/app/tabs/community/community-faq-section'
import { CommunityFlowSection } from '~/app/tabs/community/community-flow-section'
import {
  COMMUNITY_STAT_GRID,
  type CommunityStat,
} from '~/app/tabs/community/community-shared'

const STAT_PLACEHOLDER = '—'

function formatCommunityStatToday(
  template: string,
  count: number | string = STAT_PLACEHOLDER,
  amount: number | string = STAT_PLACEHOLDER,
) {
  return applyMessageTemplate(template, {
    count: typeof count === 'number' ? formatCount(count) : count,
    amount: typeof amount === 'number' ? formatUsd(amount, 0) : amount,
  })
}

export function CommunityContent({
  onSelectTab,
}: {
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady, tab } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const [invitesPage, setInvitesPage] = useState(1)
  const { data: overview, isLoading: overviewLoading } = useTeamOverview(sessionReady)
  const { displayRank, isRankLoading } = useShareholderRank()
  const { data: referrals, isLoading: referralsLoading } = useTeamReferrals(
    tablePageQuery(invitesPage),
    sessionReady,
  )

  const inviteRowsCompact =
    referrals?.items.map((item) => mapTeamReferralToCompactRow(item)) ?? []
  const compactRows = inviteRowsCompact
  const invitesTotal = referrals?.total ?? 0
  const invitesTable = dappTableViewState({
    sessionReady,
    isLoading: referralsLoading,
    isLoggingIn,
    rowCount: compactRows.length,
  })
  const inviteCount = !sessionReady
    ? formatCount(0)
    : overviewLoading || referralsLoading || isLoggingIn
      ? '…'
      : formatCount(overview?.descendant_count ?? referrals?.total ?? 0)
  const inviteSectionTitle = t.community.myInvites.replace('{count}', inviteCount)
  const authPending = sessionReady && isLoggingIn

  if (!sessionReady) {
    return (
      <DappDetailPage>
        <CommunityFlowSection isMobileViewport={isMobileViewport} onSelectTab={onSelectTab} />
        <CommunityFaqSection />
      </DappDetailPage>
    )
  }

  const useStatPlaceholders = authPending || overviewLoading || isRankLoading

  const directCount = formatCount(overview?.direct_referral_count ?? 0)
  const directVolume = formatUsd(overview?.direct_presale_volume ?? 0)

  const teamCount = formatCount(overview?.descendant_count ?? 0)
  const teamVolume = formatUsd(overview?.sales_team_market ?? 0)

  const shareholderRank = formatPresaleRank(displayRank)
  const genesisShareholderLabel =
    displayRank > 0 ? t.community.genesisShareholder : t.rewards.shareholderHintNoRank

  const stats: CommunityStat[] = [
    {
      label: t.community.directReferrals,
      value: directCount,
      volume: `${t.community.volumePrefix} ${directVolume}`,
      today: formatCommunityStatToday(
        t.community.statToday,
        useStatPlaceholders ? STAT_PLACEHOLDER : (overview?.today_addition_direct_count ?? 0),
        useStatPlaceholders
          ? STAT_PLACEHOLDER
          : Number(overview?.today_addition_direct_presale_volume ?? 0),
      ),
    },
    {
      label: t.community.myTeam,
      value: teamCount,
      volume: `${t.community.volumePrefix} ${teamVolume}`,
      today: formatCommunityStatToday(
        t.community.statToday,
        useStatPlaceholders ? STAT_PLACEHOLDER : (overview?.today_addition_team_count ?? 0),
        useStatPlaceholders
          ? STAT_PLACEHOLDER
          : Number(overview?.today_addition_sales_team_market ?? 0),
      ),
    },
    {
      label: t.community.genesisTitle,
      value: shareholderRank,
      volume: genesisShareholderLabel,
      today: t.community.statGenesisToday,
      dark: !isMobileViewport,
    },
  ]

  const inviteTableHeaders = [
    t.tables.joined,
    t.tables.address,
    t.community.shareholder,
    t.tables.genesisRank,
    t.community.directReferrals,
    t.tables.communityVolume,
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
                  'items-center text-center shadow-card [&>b]:hidden [&>small]:hidden [&>span]:text-xs [&>span]:tracking-[-0.11px] [&>strong]:text-lg [&>strong]:tracking-[-0.54px]',
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
        <DappTableCard
          footer={
            !invitesTable.requiresAuth ? (
              <DappTablePagination
                embedded
                onPageChange={setInvitesPage}
                page={invitesPage}
                total={invitesTotal}
              />
            ) : undefined
          }
        >
          {invitesTable.requiresAuth ? (
            <DappTableAuthPrompt body={t.dapp.connect.recordsBodyCommunity} embedded />
          ) : invitesTable.queryEmpty ? (
            <>
              <ResponsiveTable
                className={communityInviteTableClass}
                compact
                headers={inviteTableHeaders}
                linkColumns={[1]}
                rows={[]}
              />
              <DappTableEmptyMessage
                body={t.community.invitesEmpty.body}
                embedded
                title={t.community.invitesEmpty.title}
              />
            </>
          ) : (
            <ResponsiveTable
              className={communityInviteTableClass}
              compact
              headers={inviteTableHeaders}
              isLoading={invitesTable.showSkeleton}
              linkColumns={[1]}
              rows={compactRows}
            />
          )}
        </DappTableCard>
      </DappSection>

      <CommunityFaqSection />
    </DappDetailPage>
  )
}
