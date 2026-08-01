import { type ReactNode } from 'react'

import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappSection } from '~/app/shell/dapp-section'
import { DappTableAuthPrompt } from '~/app/shell/dapp-table-auth-prompt'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { communityInviteColWidths } from '~/app/shell/dapp-table-columns'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { formatGroupedNumber, formatPresaleRank } from '~/shared/api/format-display'
import { dappTableViewState } from '~/shared/lib/table-pagination'
import { Text } from '~/shared/ui/text'
import {
  CommunityStatCard,
  CommunityStatGrid,
} from '~/views/dapp/community/community-content-primitives'
import { mapTeamReferralToCompactRow } from '~/views/dapp/community/community-display'
import { CommunityFaqSection } from '~/views/dapp/community/community-faq-section'
import { CommunityFlowSection } from '~/views/dapp/community/community-flow-section'
import { useCommunityContentView } from '~/views/dapp/community/use-community-content-view'

type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  value: ReactNode
  volume?: ReactNode
}

export function CommunityContent() {
  const {
    t,
    sessionReady,
    walletReady,
    isMobileViewport,
    isLoggingIn,
    invitesPage,
    setInvitesPage,
    overview,
    displayRank,
    referrals,
    referralsLoading,
  } = useCommunityContentView()

  const inviteRowsCompact = referrals?.items.map((item) => mapTeamReferralToCompactRow(item)) ?? []
  const compactRows = inviteRowsCompact
  const invitesTotal = referrals?.total ?? 0
  const invitesTable = dappTableViewState({
    sessionReady,
    isLoading: referralsLoading,
    isLoggingIn,
    rowCount: compactRows.length,
  })
  const inviteCount = !sessionReady
    ? formatGroupedNumber(0, { digits: 0, trimZeros: true })
    : formatGroupedNumber(overview?.descendant_count ?? referrals?.total ?? 0, {
        digits: 0,
        trimZeros: true,
      })
  const inviteSectionTitle = t.community.myInvites.replace('{count}', inviteCount)
  const authPending = sessionReady && isLoggingIn

  // Disconnected: browse flow + FAQ only (no invented empty-member state).
  if (!walletReady) {
    return (
      <DappDetailPage>
        <CommunityFlowSection isMobileViewport={isMobileViewport} />
        <CommunityFaqSection />
      </DappDetailPage>
    )
  }

  // Never `isLoading ? 0` — that flashes 2000→0→3000; use ?? 0 on cached/missing fields.
  const directCount = formatGroupedNumber(overview?.direct_referral_count ?? 0, {
    digits: 0,
    trimZeros: true,
  })
  const directVolume = formatGroupedNumber(overview?.direct_presale_volume ?? 0, { prefix: '$' })
  const teamCount = formatGroupedNumber(overview?.descendant_count ?? 0, {
    digits: 0,
    trimZeros: true,
  })
  const teamVolume = formatGroupedNumber(overview?.sales_team_market ?? 0, { prefix: '$' })

  // Figma `4300:212` stats = label / value / 业绩|共建等级 only（无「今日」行）.
  // Value = genesis (presale) rank only — never substitute making_rank (A0–A13 做市等级).
  const genesisRankValue =
    !sessionReady || authPending
      ? formatPresaleRank(0)
      : displayRank > 0
        ? formatPresaleRank(displayRank)
        : formatPresaleRank(0)

  const stats: CommunityStat[] = [
    {
      label: t.community.directReferrals,
      value: directCount,
      volume: `${t.community.volumePrefix} ${directVolume}`,
    },
    {
      label: t.community.myTeam,
      value: teamCount,
      volume: `${t.community.volumePrefix} ${teamVolume}`,
    },
    {
      label: t.community.genesisTitle,
      value: genesisRankValue,
      volume: t.community.cobuildLevel,
      dark: !isMobileViewport,
    },
  ]

  const inviteTableHeaders = [
    t.tables.joined,
    t.tables.address,
    t.community.shareholder,
    t.community.cobuildLevel,
    t.community.directReferrals,
    t.tables.communityVolume,
  ]

  return (
    <DappDetailPage>
      <DappContentHeading id="community-title" reveal>
        {t.community.myCommunity}
      </DappContentHeading>

      <CommunityStatGrid>
        {stats.map((stat, index) => (
          <CommunityStatCard
            dark={stat.dark}
            image={stat.image}
            key={index}
            label={stat.label}
            value={stat.value}
            volume={stat.volume}
          />
        ))}
      </CommunityStatGrid>

      <CommunityFlowSection isMobileViewport={isMobileViewport} />

      <DappSection title={inviteSectionTitle}>
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
            <div className="flex min-h-[6.75rem] items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 py-10">
              <Text as="p" className="text-center" tone="muted-foreground" variant="detail">
                {`${t.community.invitesEmpty.title}，${t.community.invitesEmpty.body}`}
              </Text>
            </div>
          ) : (
            <ResponsiveTable
              colWidths={[...communityInviteColWidths]}
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
