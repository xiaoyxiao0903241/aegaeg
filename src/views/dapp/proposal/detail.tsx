/**
 * 提案右栏
 *
 * 统计卡、我的投票、机制说明、奖励记录与 FAQ。
 * 未登录时表走 Body 会话闸（disable 空态），与涡轮 / 奖励记录同构。
 */
import type { ReactNode } from 'react'

import { interpolate } from '~/i18n/interpolate'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { MainButton } from '~/shared/components/main-button'
import { Section } from '~/shared/components/section'
import { Skeleton } from '~/shared/components/skeleton'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { formatDecimal, interpolateLive } from '~/shared/presenters/format'
import {
  MechanismCard,
  ProposalClaimCopy,
  ProposalLockCopy,
  ProposalStateBadge,
  proposalStateKey,
  ProposalSupportBadge,
} from '~/views/dapp/proposal/primitives'
import { type ProposalVoteRow, useProposalDetail } from '~/views/dapp/proposal/use-proposal'

/** 参与率：接口可能给 0–1 或已经是百分比，统一打成整数 %。 */
function formatParticipation(rate: number | null | undefined): string {
  if (rate == null || !Number.isFinite(rate)) return formatDecimal(null)
  const pct = rate > 0 && rate <= 1 ? rate * 100 : rate
  return formatDecimal(pct, { digits: 0, suffix: '%' })
}

function StatValue({ loading, text }: { loading?: boolean; text: string }) {
  return (
    <Text as="strong" className="min-w-0 font-semibold tabular-nums" variant="headline">
      {loading ? <Skeleton className="h-7 w-12" /> : <CountValue text={text} />}
    </Text>
  )
}

function supportKey(support: ProposalVoteRow['support']) {
  if (support === 1) return 'for' as const
  if (support === 0) return 'against' as const
  if (support === 2) return 'abstain' as const
  return null
}

function ProposalCodeLink({ code, onOpen }: { code: string; onOpen: () => void }) {
  return (
    <button
      className="cursor-pointer border-0 bg-transparent p-0 text-left"
      onClick={onOpen}
      type="button"
    >
      <Text
        as="span"
        className="font-semibold underline underline-offset-2"
        tone="primary"
        variant="copy"
      >
        {code}
      </Text>
    </button>
  )
}

function TableAction({
  children,
  disabled,
  loading,
  onClick,
}: {
  children: string
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}) {
  return (
    <MainButton
      className="min-h-8 px-4"
      density="inverse"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </MainButton>
  )
}

export function ProposalDetail() {
  const detail = useProposalDetail()
  const { t } = detail
  const stats = detail.stats
  const statsLoading = detail.sessionReady && stats == null

  const mechanismSection = (
    <Section reveal>
      <Section.Title>{t.proposal.mechanismTitle}</Section.Title>
      <Grid columns={3} stackOnDapp>
        {t.proposal.mechanism.items.map((item) => (
          <MechanismCard body={item.body} key={item.title} title={item.title} />
        ))}
      </Grid>
      <Card className="mt-3 grid gap-2.5 px-5 py-4.5" surface="outlined">
        <Text as="strong" className="font-semibold" variant="detail">
          {t.proposal.eligibility.title}
        </Text>
        <Text as="p" className="m-0 text-pretty text-foreground/55" variant="copy">
          {t.proposal.eligibility.body}
        </Text>
      </Card>
    </Section>
  )

  const total = formatDecimal(stats?.total, { digits: 0, fraction: 'natural' })
  const active = formatDecimal(stats?.active_count, { digits: 0, fraction: 'natural' })
  const pending = formatDecimal(stats?.pending_count, { digits: 0, fraction: 'natural' })
  const participation = formatParticipation(stats?.recent_participation_rate)

  const voteRows: ReactNode[][] = detail.voteRows.map((row) => {
    const support = supportKey(row.support)
    return [
      row.time,
      <ProposalCodeLink code={row.code} key="code" onOpen={() => detail.openProposal(row.id)} />,
      support == null ? (
        '—'
      ) : (
        <ProposalSupportBadge key="support" support={row.support}>
          {t.proposal.support[support]}
        </ProposalSupportBadge>
      ),
      row.power,
      <ProposalStateBadge key="state" state={row.state}>
        {row.state == null ? '—' : t.proposal.state[proposalStateKey(row.state)]}
      </ProposalStateBadge>,
      row.lock === 'unlockable' ? (
        <TableAction
          key="unlock"
          disabled={detail.withdrawing}
          loading={detail.withdrawing}
          onClick={() => detail.onWithdraw(row.id)}
        >
          {t.proposal.unlock}
        </TableAction>
      ) : (
        <ProposalLockCopy key="lock" kind={row.lock}>
          {t.proposal.lock[row.lock]}
        </ProposalLockCopy>
      ),
    ]
  })

  const rewardRows: ReactNode[][] = detail.voteRows.map((row) => [
    row.time,
    <ProposalCodeLink code={row.code} key="code" onOpen={() => detail.openProposal(row.id)} />,
    row.power,
    row.reward,
    row.claim === 'claimable' ? (
      <TableAction
        key="claim"
        disabled={detail.withdrawing}
        loading={detail.withdrawing}
        onClick={() => detail.onWithdraw(row.id)}
      >
        {t.proposal.claim}
      </TableAction>
    ) : (
      <ProposalClaimCopy key="claim-status" kind={row.claim}>
        {t.proposal.claimStatus[row.claim]}
      </ProposalClaimCopy>
    ),
  ])

  return (
    <Detail>
      <Section reveal>
        <Section.Title>{t.proposal.statsTitle}</Section.Title>
        <Grid columns={3} stackOnDapp>
          <Tile>
            <Tile.Label>{t.proposal.statTotal}</Tile.Label>
            <StatValue loading={statsLoading} text={total} />
            <Tile.Note>
              {statsLoading ? (
                <Skeleton className="h-3.5 w-32" />
              ) : (
                interpolateLive(t.proposal.statTotalNote, { active, pending })
              )}
            </Tile.Note>
          </Tile>
          <Tile>
            <Tile.Label>{t.proposal.statLocked}</Tile.Label>
            <StatValue text={detail.lockedLabel} />
            <Tile.Note>
              <CountValue
                text={interpolate(t.proposal.statLockedNote, { amount: detail.availableLabel })}
              />
            </Tile.Note>
          </Tile>
          <Tile>
            <Tile.Label>{t.proposal.statParticipation}</Tile.Label>
            <StatValue loading={statsLoading} text={participation} />
            <Tile.Note>{t.proposal.statParticipationNote}</Tile.Note>
          </Tile>
        </Grid>
      </Section>

      <Section reveal>
        <Section.Title>{t.proposal.votesTitle}</Section.Title>
        {/* jscpd:ignore-start — 投票/奖励两表页内拼装，分页与空态同构，禁再抽表壳 */}
        <Table>
          <Table.Body
            authBody={t.dapp.connect.recordsBodyProposal}
            compact
            empty={t.proposal.votesEmpty}
            endColumns={[3, 5]}
            headers={[...t.proposal.voteColumns]}
            isLoading={detail.votesLoading}
            mutedColumns={[0]}
            primaryColumns={[1]}
            rows={voteRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={detail.setVotesPage}
              page={detail.votesPage}
              total={detail.votesTotal}
            />
          </Table.Footer>
        </Table>
      </Section>

      {mechanismSection}

      <Section reveal>
        <Section.Title>{t.proposal.rewardsTitle}</Section.Title>
        <Table>
          <Table.Body
            authBody={t.dapp.connect.recordsBodyProposal}
            compact
            empty={t.proposal.rewardsEmpty}
            endColumns={[2, 3, 4]}
            headers={[...t.proposal.rewardColumns]}
            isLoading={detail.votesLoading}
            mutedColumns={[0]}
            primaryColumns={[1, 3]}
            rows={rewardRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={detail.setVotesPage}
              page={detail.votesPage}
              total={detail.votesTotal}
            />
          </Table.Footer>
        </Table>
        {/* jscpd:ignore-end */}
      </Section>

      <Section collapsible>
        <Section.Title>{t.proposal.faq.title}</Section.Title>
        <Faq items={t.proposal.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
