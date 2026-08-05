import { type ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { communityInviteColWidths } from '~/app/shell/table-columns'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { formatGroupedNumber, formatPresaleRank } from '~/shared/api/format-display'
import { Detail } from '~/shared/components/detail'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { dappTableViewState } from '~/shared/lib/table-pagination'
import {
  CommunityStatCard,
  CommunityStatGrid,
} from '~/views/dapp/community/community-content-primitives'
import { mapTeamReferralToCompactRow } from '~/views/dapp/community/community-display'
import { CommunityFaqSection } from '~/views/dapp/community/community-faq-section'
import {
  CommunityInviteSection,
  CommunityProgramsSection,
} from '~/views/dapp/community/community-flow-section'
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
    : formatGroupedNumber(overview?.direct_referral_count ?? referrals?.total ?? 0, {
        digits: 0,
        trimZeros: true,
      })
  const inviteSectionTitle = t.community.myInvites.replace('{count}', inviteCount)
  const authPending = sessionReady && isLoggingIn

  // Disconnected: browse flow + FAQ only (no invented empty-member state).
  if (!walletReady) {
    return (
      <Detail>
        <CommunityInviteSection />
        <CommunityProgramsSection />
        <CommunityFaqSection />
      </Detail>
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
      image: isMobileViewport ? undefined : dappAssets.communityRankDeco,
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

  const emptyTitle = `${t.community.invitesEmpty.title}，${t.community.invitesEmpty.body}`

  return (
    <Detail>
      <Section reveal>
        <Section.Title id="community-title">{t.community.myCommunity}</Section.Title>
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
      </Section>

      <CommunityInviteSection />
      <CommunityProgramsSection />

      <Section reveal>
        <Section.Title>{inviteSectionTitle}</Section.Title>
        <Table>
          {invitesTable.requiresAuth ? (
            <Table.Auth
              body={t.dapp.connect.recordsBodyCommunity}
              embedded
              title={t.dapp.connect.recordsTitle}
            >
              <WalletConnectChip variant="primary" />
            </Table.Auth>
          ) : invitesTable.queryEmpty ? (
            <div data-slot-id="community-members-empty">
              <Table.Empty embedded title={emptyTitle} />
            </div>
          ) : (
            <Table.Body
              colWidths={[...communityInviteColWidths]}
              compact
              headers={inviteTableHeaders}
              isLoading={invitesTable.showSkeleton}
              linkColumns={[1]}
              rows={compactRows}
            />
          )}
          {!invitesTable.requiresAuth ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setInvitesPage}
                page={invitesPage}
                total={invitesTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <CommunityFaqSection />
    </Detail>
  )
}
