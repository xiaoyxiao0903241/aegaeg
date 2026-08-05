/**
 * 发展津贴详情页
 *
 * 顶部两张统计卡（等级、累计已领），
 * 下方按「发放 / 领取」Tab 切换明细表格，底部为 FAQ。
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
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsGrantDetail } from '~/views/dapp/rewards/detail/use-rewards-grant-detail'

export function RewardsGrantDetail() {
  const {
    grant,
    recordsTab,
    setRecordsTab,
    recordsTabOptions,
    isIssue,
    tier,
    totalClaimed,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
  } = useRewardsGrantDetail()

  const overviewTiles = [
    { key: 'tier', label: grant.tier, value: tier },
    { key: 'totalClaimed', label: grant.totalClaimed, value: totalClaimed },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title>{grant.dataTitle}</Section.Title>
        <Grid columns={2}>
          {overviewTiles.map((item) => (
            <Tile key={item.key}>
              <Tile.Label>{item.label}</Tile.Label>
              <Text
                as="strong"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                <CountValue text={item.value} />
              </Text>
            </Tile>
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{grant.recordsTitle}</Section.Title>
        {/* jscpd:ignore-start — Table 页内拼装（禁再抽薄包装） */}
        <Table>
          <Table.Header>
            {rewardsRecordsPillTabsHeader({
              ariaLabel: grant.recordsTabsAria,
              options: recordsTabOptions,
              value: recordsTab,
              onChange: (next) => setRecordsTab(next as typeof recordsTab),
            })}
          </Table.Header>
          <Table.Body
            colWidths={
              isIssue
                ? ['10rem', '8.75rem', '3.75rem', '8.125rem', '4.375rem', '1fr']
                : ['11.875rem', '10rem', '1fr']
            }
            emphasisColumns={[1]}
            empty={isIssue ? grant.emptyIssue : grant.emptyClaim}
            headers={[...(isIssue ? grant.issueColumns : grant.claimColumns)]}
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
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{grant.faq.title}</Section.Title>
        <Faq items={grant.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
