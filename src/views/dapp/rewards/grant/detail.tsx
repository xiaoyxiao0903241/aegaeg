/**
 * 发展津贴详情页
 *
 * 顶部两张统计卡（等级、累计已领），
 * 下方按「发放 / 领取」Tab 切换明细表格，底部为 FAQ。
 */
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useGrant } from '~/views/dapp/rewards/grant/use-grant'
import { rewardsRecordsChipTabsHeader } from '~/views/dapp/rewards/primitives'

export function GrantDetail() {
  const {
    grant,
    recordsTab,
    setRecordsTab,
    recordsTabOptions,
    isIssue,
    tier,
    totalClaimed,
    totalClaimedApprox,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
  } = useGrant()

  const overviewTiles = [
    { key: 'tier', label: grant.tier, value: tier },
    {
      key: 'totalClaimed',
      label: grant.totalClaimed,
      value: totalClaimed,
      note: totalClaimedApprox,
    },
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
              {'note' in item && item.note != null ? <Tile.Note>{item.note}</Tile.Note> : null}
            </Tile>
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{grant.recordsTitle}</Section.Title>
        {/* jscpd:ignore-start — Table 页内拼装（禁再抽薄包装） */}
        <Table>
          <Table.Header>
            {rewardsRecordsChipTabsHeader({
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
