/**
 * 共建奖详情页
 *
 * 顶部六张统计卡（总奖励、做市、我的仓位、直推数、贡献、下次发放），
 * 中部等级卡展示当前/下一级档位与晋升条件进度，
 * 下方为等级记录 / 超越记录双 Tab 表格与可按列排序的「我的团队」表，底部为 FAQ。
 */
import { COBUILD_TEAM_COLUMN_SORT, type CobuildTeamSort } from '~/core/rewards/cobuild-team-sort'
import { interpolate } from '~/i18n/interpolate'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { cn } from '~/shared/lib/utils'
import { CobuildTierCard } from '~/views/dapp/rewards/cobuild/primitives'
import { useCobuild } from '~/views/dapp/rewards/cobuild/use-cobuild'
import { HideZeroToggle, rewardsRecordsChipTabsHeader } from '~/views/dapp/rewards/primitives'
import { withContributionRatio } from '~/views/dapp/shared/contribution-claim-ratio'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'

export function CobuildDetail() {
  const {
    cobuild,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    totalRewards,
    totalRewardsApprox,
    totalPerformance,
    myPosition,
    nextPayout,
    hideZeroMarket,
    setHideZeroMarket,
    teamSort,
    setTeamSortColumn,
    tierCurrent,
    tierNext,
    tierCurrentRate,
    tierNextRate,
    tierHasNext,
    tierMaxLabel,
    tierProgressTitle,
    tierProgressCount,
    achievedLabel,
    tierReqs,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    directRows,
    directsLoading,
    directsPage,
    setDirectsPage,
    directsTotal,
    recordsTabOptions,
  } = useCobuild()
  const claimRatio = useContributionClaimRatioLabel()
  const contributionHint = withContributionRatio(cobuild.contributionHint, claimRatio)

  const overviewTiles = [
    {
      key: 'totalRewards',
      label: cobuild.totalRewards,
      value: totalRewards,
      note: totalRewardsApprox,
    },
    { key: 'totalPerformance', label: cobuild.totalPerformance, value: totalPerformance },
    { key: 'myPosition', label: cobuild.myPosition, value: myPosition },
    { key: 'directCount', label: cobuild.directCount, value: referralCount },
    {
      key: 'contribution',
      label: cobuild.contribution,
      value: contributionValue,
      valueHint: contributionHint,
    },
    { key: 'nextPayout', label: cobuild.nextPayout, value: nextPayout },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title>{cobuild.dataTitle}</Section.Title>
        {/* jscpd:ignore-start — Tile 指标区页内拼装，禁再抽统一包装 */}
        <Grid columns={3}>
          {overviewTiles.map((item) => (
            <Tile key={item.key}>
              <Tile.Label>{item.label}</Tile.Label>
              <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <Text
                  as="strong"
                  className="leading-none font-semibold wrap-break-word"
                  variant="headline"
                >
                  <CountValue text={item.value} />
                </Text>
                {'valueHint' in item && item.valueHint != null ? (
                  <Text
                    as="span"
                    className="leading-none wrap-break-word text-foreground/40"
                    variant="copy"
                  >
                    {item.valueHint}
                  </Text>
                ) : null}
              </span>
              {'note' in item && item.note != null ? <Tile.Note>{item.note}</Tile.Note> : null}
            </Tile>
          ))}
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{cobuild.tierTitle}</Section.Title>
        <CobuildTierCard
          achievedLabel={achievedLabel}
          currentLabel={cobuild.tierCurrent}
          currentRate={tierCurrentRate}
          currentValue={tierCurrent}
          hasNext={tierHasNext}
          maxLabel={tierMaxLabel}
          nextLabel={cobuild.tierNext}
          nextRate={tierNextRate}
          nextValue={tierNext}
          progressCount={tierProgressCount}
          progressTitle={tierProgressTitle}
          reqs={tierReqs}
        />
      </Section>

      <Section>
        <Section.Title>{cobuild.recordsTitle}</Section.Title>
        <Table>
          <Table.Header>
            {rewardsRecordsChipTabsHeader({
              ariaLabel: cobuild.recordsTabsAria,
              options: recordsTabOptions,
              value: recordsTab,
              onChange: (next) => setRecordsTab(next as typeof recordsTab),
            })}
          </Table.Header>
          <Table.Body
            emphasisColumns={[1, 2]}
            empty={
              recordsTab === 'cobuild' ? cobuild.emptyRecordsCobuild : cobuild.emptyRecordsEqualize
            }
            headers={[...cobuild.recordsColumns]}
            mutedColumns={[0, 4]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setRecordsPage}
              page={recordsPage}
              total={recordsTotal}
            />
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <div className="flex items-center justify-between gap-3">
          <Section.Title>{interpolate(cobuild.teamTitle, { count: directsTotal })}</Section.Title>
          <HideZeroToggle
            checked={hideZeroMarket}
            label={cobuild.hideZeroMarket}
            onChange={setHideZeroMarket}
          />
        </div>
        <Table>
          <Table.Body
            emphasisColumns={[3]}
            empty={cobuild.emptyTeam}
            mutedColumns={[0]}
            headers={cobuild.teamColumns.map((label, index) => {
              const column = COBUILD_TEAM_COLUMN_SORT[index]
              if (column == null) return label
              return (
                <TeamSortHeader
                  active={teamSort.column === column}
                  dir={teamSort.dir}
                  label={label}
                  onClick={() => setTeamSortColumn(column)}
                />
              )
            })}
            isLoading={directsLoading}
            rows={directRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setDirectsPage}
              page={directsPage}
              total={directsTotal}
            />
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <Section.Title>{cobuild.faq.title}</Section.Title>
        <Faq items={cobuild.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}

/** 团队表可排序列头：活动列珊瑚色三角，其余灰色双向箭头。 */
function TeamSortHeader({
  active,
  dir,
  label,
  onClick,
}: {
  active: boolean
  dir: CobuildTeamSort['dir']
  label: string
  onClick: () => void
}) {
  const icon = active ? (dir === 'desc' ? '▼' : '▲') : '⇅'
  return (
    <button
      className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-foreground/40 hover:text-foreground"
      onClick={onClick}
      type="button"
    >
      <Text as="span" className="text-inherit" variant="copy">
        {label}
      </Text>
      <span
        aria-hidden
        className={cn('text-[10px] leading-none', active ? 'text-primary' : 'text-foreground/40')}
      >
        {icon}
      </span>
    </button>
  )
}
