/**
 * 共建奖详情页
 *
 * 顶部六张统计卡（总奖励、做市、我的位置、直推数、贡献、下次发放），
 * 中部等级卡展示当前/下一级档位与需求进度徽章，
 * 下方为等级记录 / 超越记录双 Tab 表格与直推成员表，底部为 FAQ。
 */
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { CobuildTierCard } from '~/views/dapp/rewards/cobuild/primitives'
import { useCobuild } from '~/views/dapp/rewards/cobuild/use-cobuild'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/records-pill-tabs'

export function CobuildDetail() {
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
  } = useCobuild()

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
          nextLabel={cobuild.tierNext}
          nextRate={tierNextRate}
          nextValue={tierNext}
          reqs={tierReqs}
        />
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
        <Faq items={cobuild.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
