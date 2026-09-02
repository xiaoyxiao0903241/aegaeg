/**
 * 社区页
 *
 * 顶部统计卡展示直邀人数、社区规模与共建等级；
 * 正文依次为邀请引导、生态支持双卡、邀请明细表与常见问题。
 * 未连接钱包时只展示浏览类区块与 FAQ，不出现空成员态。
 */
import { type ReactNode } from 'react'

import { useGenesisPromoChrome } from '~/hooks/use-genesis-promo'
import { interpolate } from '~/i18n/interpolate'
import { cobuildTierDecoSrc, dappAssets } from '~/shared/assets/dapp'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Skeleton } from '~/shared/components/skeleton'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { rewardsHashForView } from '~/shared/config/dapp-deep-links'
import { dappTableViewState } from '~/shared/lib/table-pagination'
import { formatMakingRankLabel, formatNumber } from '~/shared/presenters/format'
import {
  CommunityInviteCard,
  CommunityProgramCard,
  CommunityStatCard,
} from '~/views/dapp/community/primitives'
import { mapTeamReferralToCompactRow } from '~/views/dapp/community/shared'
import { useCommunityDetail } from '~/views/dapp/community/use-community'
import { WalletConnectChip } from '~/views/dapp/host/wallet/wallet-connect-chip'

function inviteRewardBody(template: string, linkLabel: string): ReactNode {
  const marker = '{link}'
  const idx = template.indexOf(marker)
  if (idx < 0) return template
  return (
    <>
      {template.slice(0, idx)}
      <Text as="a" className="text-primary" href={rewardsHashForView('hub')}>
        {linkLabel}
      </Text>
      {template.slice(idx + marker.length)}
    </>
  )
}

type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  note?: ReactNode
  value: ReactNode
  volume?: ReactNode
}

export function CommunityDetail() {
  const {
    t,
    sessionReady,
    walletReady,
    isLoggingIn,
    invitesPage,
    setInvitesPage,
    makingOverview,
    makingOverviewLoading,
    overview,
    overviewLoading,
    referrals,
    referralsLoading,
  } = useCommunityDetail()
  const genesis = useGenesisPromoChrome()

  const inviteSteps = t.community.inviteFlow.items.map(({ title, body }) => ({
    title,
    body: inviteRewardBody(body, t.community.inviteFlow.rewardLink),
  }))
  const programItems = t.community.programs.items.map((program, index) => {
    if (index !== 0) return program
    return {
      ...program,
      label: interpolate(program.label, {
        season: String(genesis.activeSeasonNumber),
      }),
    }
  })

  const browseSections = (
    <>
      <Section reveal>
        <Section.Title>{t.community.inviteTitle}</Section.Title>
        <CommunityInviteCard steps={inviteSteps} />
      </Section>
      <Section reveal>
        <Section.Title>{t.community.programs.title}</Section.Title>
        <Grid columns={2} stackOnDapp>
          {programItems.map((program) => (
            <CommunityProgramCard
              action={program.action}
              body={program.body}
              href={program.href}
              key={program.label}
              label={program.label}
              title={program.title}
            />
          ))}
        </Grid>
      </Section>
    </>
  )

  const compactRows = referrals?.items.map((item) => mapTeamReferralToCompactRow(item)) ?? []
  const invitesTotal = referrals?.total ?? 0
  const invitesTable = dappTableViewState({
    sessionReady,
    isLoading: referralsLoading,
    isLoggingIn,
    rowCount: compactRows.length,
  })
  const inviteCount = !sessionReady
    ? formatNumber(0, { digits: 0, trimZeros: true })
    : formatNumber(makingOverview?.direct_referral_count ?? referrals?.total ?? 0, {
        digits: 0,
        trimZeros: true,
      })
  const inviteSectionTitle = interpolate(t.community.myInvites, { count: inviteCount })
  const authPending = sessionReady && isLoggingIn
  const statsLoading =
    sessionReady &&
    ((makingOverviewLoading && makingOverview == null) || (overviewLoading && overview == null))

  // 未连接钱包：只展示浏览流程与 FAQ，不造空成员态。
  if (!walletReady) {
    return (
      <Detail>
        {browseSections}
        <Section collapsible>
          <Section.Title>{t.community.faq.title}</Section.Title>
          <Faq items={t.community.faq.items} variant="dapp" />
        </Section>
      </Detail>
    )
  }

  // 不能用 isLoading ? 0：加载中 2000 会闪成 0 再变回 3000，用 ?? 0 兜底缺失字段
  const directCount = formatNumber(makingOverview?.direct_referral_count ?? 0, {
    digits: 0,
    trimZeros: true,
  })
  const directVolume = formatNumber(makingOverview?.making_direct_team_market ?? 0, { prefix: '$' })
  const teamCount = formatNumber(makingOverview?.team_count ?? 0, {
    digits: 0,
    trimZeros: true,
  })
  const teamVolume = formatNumber(makingOverview?.making_market ?? 0, { prefix: '$' })
  const todayDirect = interpolate(t.community.statToday, {
    count: formatNumber(overview?.today_addition_direct_count ?? 0, {
      digits: 0,
      trimZeros: true,
    }),
    amount: formatNumber(makingOverview?.today_addition_making_direct_team_market ?? 0, {
      prefix: '$',
    }),
  })
  const todayTeam = interpolate(t.community.statToday, {
    count: formatNumber(overview?.today_addition_team_count ?? 0, { digits: 0, trimZeros: true }),
    amount: formatNumber(makingOverview?.today_addition_making_market ?? 0, { prefix: '$' }),
  })

  const makingRank = sessionReady && !authPending ? makingOverview?.making_rank : null
  const rankValue = formatMakingRankLabel(makingRank, '—')
  const rewardRateNote = interpolate(t.community.statRewardRate, {
    rate: t.rewards.hub.tierTable.rows.find((row) => row.level === rankValue)?.rate ?? '—',
  })

  const stats: CommunityStat[] = [
    {
      label: t.community.directReferrals,
      value: statsLoading ? <Skeleton className="h-7 w-16" /> : directCount,
      volume: statsLoading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        `${t.community.volumePrefix} ${directVolume}`
      ),
      note: statsLoading ? <Skeleton className="h-3.5 w-28" /> : todayDirect,
    },
    {
      label: t.community.myTeam,
      value: statsLoading ? <Skeleton className="h-7 w-16" /> : teamCount,
      volume: statsLoading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        `${t.community.volumePrefix} ${teamVolume}`
      ),
      note: statsLoading ? <Skeleton className="h-3.5 w-28" /> : todayTeam,
    },
    {
      label: t.community.genesisTitle,
      value: statsLoading ? <Skeleton className="h-7 w-20" tone="dark" /> : rankValue,
      volume: t.community.cobuildLevel,
      note: statsLoading ? <Skeleton className="h-3.5 w-24" tone="dark" /> : rewardRateNote,
      dark: true,
      image: cobuildTierDecoSrc(makingRank, dappAssets.communityRankDeco),
    },
  ]

  const inviteTableHeaders = [
    t.tables.joined,
    t.tables.address,
    t.tables.holding,
    t.community.makingLevel,
    t.community.directReferrals,
    t.tables.communityVolume,
  ]

  const emptyTitle = `${t.community.invitesEmpty.title}，${t.community.invitesEmpty.body}`

  return (
    <Detail>
      <Section reveal>
        <Section.Title id="community-title">{t.community.myCommunity}</Section.Title>
        <Grid columns={3} stackOnDapp>
          {stats.map((stat, index) => (
            <CommunityStatCard
              dark={stat.dark}
              image={stat.image}
              key={index}
              label={stat.label}
              note={stat.note}
              value={stat.value}
              volume={stat.volume}
            />
          ))}
        </Grid>
      </Section>

      {browseSections}

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
              compact
              headers={inviteTableHeaders}
              isLoading={invitesTable.showSkeleton}
              linkColumns={[1]}
              mutedColumns={[0]}
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

      <Section collapsible>
        <Section.Title>{t.community.faq.title}</Section.Title>
        <Faq items={t.community.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
