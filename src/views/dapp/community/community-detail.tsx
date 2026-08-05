/**
 * 社区页
 *
 * 顶部统计卡展示直邀人数、团队规模与创世共建等级；
 * 正文依次为邀请引导、生态支持双卡、邀请明细表与常见问题。
 * 未连接钱包时只展示浏览类区块与 FAQ，不出现空成员态。
 */
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
import { useCommunityDetail } from '~/views/dapp/community/use-community-detail'

type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  value: ReactNode
  volume?: ReactNode
}

export function CommunityDetail() {
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
  } = useCommunityDetail()

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

  // 未连接钱包：只展示浏览流程与 FAQ，不造空成员态。
  if (!walletReady) {
    return (
      <Detail>
        <CommunityInviteSection />
        <CommunityProgramsSection />
        <CommunityFaqSection />
      </Detail>
    )
  }

  // 不能用 isLoading ? 0：加载中 2000 会闪成 0 再变回 3000，用 ?? 0 兜底缺失字段
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

  // 统计卡只有标签 / 数值 / 业绩|共建等级三行，无「今日」行。
  // 等级只取创世（预售）共建等级，绝不用做市等级 making_rank（A0–A13）。
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
