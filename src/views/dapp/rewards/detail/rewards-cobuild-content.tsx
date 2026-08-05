/**
 * 共建奖详情页
 *
 * 顶部六张统计瓦片（总奖励、做市、我的位置、直推数、贡献、下次发放），
 * 中部等级卡展示当前/下一级档位与需求进度徽章，
 * 下方为等级记录 / 超越记录双 Tab 表格与直推成员表，底部为 FAQ。
 */
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsCobuildContentView } from '~/views/dapp/rewards/detail/use-rewards-cobuild-content-view'
import { NON_NUMERIC_EMPTY } from '~/views/dapp/rewards/rewards-display'

export function RewardsCobuildContent() {
  const {
    cobuild,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    totalRewards,
    totalPerformance,
    myPosition,
    nextPayout,
    tierCurrent,
    tierNext,
    tierCurrentRate,
    tierNextRate,
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
  } = useRewardsCobuildContentView()

  const overviewTiles = [
    { key: 'totalRewards', label: cobuild.totalRewards, value: totalRewards },
    { key: 'totalPerformance', label: cobuild.totalPerformance, value: totalPerformance },
    { key: 'myPosition', label: cobuild.myPosition, value: myPosition },
    { key: 'directCount', label: cobuild.directCount, value: referralCount },
    {
      key: 'contribution',
      label: cobuild.contribution,
      value: contributionValue,
      valueHint: cobuild.contributionHint,
    },
    { key: 'nextPayout', label: cobuild.nextPayout, value: nextPayout },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title>{cobuild.dataTitle}</Section.Title>
        {/* jscpd:ignore-start — 统计瓦片页内拼装（禁再抽统一组件） */}
        <OverviewGrid columns={3}>
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
            </Tile>
          ))}
        </OverviewGrid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{cobuild.tierTitle}</Section.Title>
        <Card surface="elevated" className="flex flex-col gap-4.5 overflow-visible rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {cobuild.tierCurrent}
              </Text>
              <div className="flex items-center gap-2.5">
                <Text
                  as="p"
                  className="leading-none font-semibold"
                  variant={tierCurrentRate !== NON_NUMERIC_EMPTY ? 'figure' : 'headline'}
                >
                  {tierCurrent}
                </Text>
                {tierCurrentRate !== NON_NUMERIC_EMPTY ? (
                  <Text
                    as="span"
                    className="rounded-full bg-primary-soft px-2 py-0.5 leading-none font-semibold text-primary"
                    variant="caption"
                  >
                    {tierCurrentRate}
                  </Text>
                ) : null}
              </div>
            </div>
            <div className="grid gap-1 text-right">
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {cobuild.tierNext}
              </Text>
              <div className="flex items-center justify-end gap-2">
                <Text as="p" className="leading-none font-semibold" variant="headline">
                  {tierNext}
                </Text>
                {tierNextRate !== NON_NUMERIC_EMPTY ? (
                  <Text
                    as="span"
                    className="leading-none font-semibold text-foreground/40"
                    variant="caption"
                  >
                    {tierNextRate}
                  </Text>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {tierReqs.map((req) => (
              <div
                className="flex flex-col gap-1.5 rounded-control bg-muted px-4 py-3.5"
                key={req.label}
              >
                <div className="flex items-center justify-between gap-2">
                  <Text as="p" className="leading-none text-foreground/40" variant="caption">
                    {req.label}
                  </Text>
                  {req.badge.kind === 'achieved' ? (
                    <Text
                      as="span"
                      className="rounded-full bg-success-soft px-2 py-0.5 leading-none font-semibold text-success"
                      variant="caption"
                    >
                      {achievedLabel}
                    </Text>
                  ) : req.badge.kind === 'pct' ? (
                    <Text
                      as="span"
                      className="rounded-full bg-primary-soft px-2 py-0.5 leading-none font-semibold text-primary"
                      variant="caption"
                    >
                      {req.badge.value}
                    </Text>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <Text as="p" className="leading-none font-semibold" variant="headline">
                    {req.value}
                  </Text>
                  <Text as="p" className="leading-none text-foreground/40" variant="caption">
                    {req.target}
                  </Text>
                </div>
                <Text as="p" className="leading-none text-foreground/40" variant="caption">
                  {req.hint}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section>
        <Section.Title>{cobuild.recordsTitle}</Section.Title>
        <Table>
          <Table.Header>
            {rewardsRecordsPillTabsHeader({
              ariaLabel: cobuild.recordsTabsAria,
              options: recordsTabOptions,
              value: recordsTab,
              onChange: (next) => setRecordsTab(next as typeof recordsTab),
            })}
          </Table.Header>
          <Table.Body
            colWidths={['12.0625rem', '3.9375rem', '9.1875rem', '6.125rem', '1fr']}
            empty={
              recordsTab === 'cobuild' ? cobuild.emptyRecordsCobuild : cobuild.emptyRecordsEqualize
            }
            headers={[...cobuild.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          {shouldShowTablePagination(recordsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={recordsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{cobuild.directsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '12.5rem', '8.125rem', '1fr']}
            emphasisColumns={[2]}
            empty={cobuild.emptyDirects}
            headers={[...cobuild.directsColumns]}
            isLoading={directsLoading}
            rows={directRows}
          />
          {shouldShowTablePagination(directsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setDirectsPage}
                page={directsPage}
                total={directsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{cobuild.faq.title}</Section.Title>
        <FaqList items={cobuild.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
