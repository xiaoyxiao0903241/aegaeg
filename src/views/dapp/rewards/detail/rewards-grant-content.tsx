import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsGrantContentView } from '~/views/dapp/rewards/detail/use-rewards-grant-content-view'

export function RewardsGrantContent() {
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
  } = useRewardsGrantContentView()

  const overviewTiles = [
    { key: 'tier', label: grant.tier, value: tier },
    { key: 'totalClaimed', label: grant.totalClaimed, value: totalClaimed },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title>{grant.dataTitle}</Section.Title>
        <OverviewGrid columns={2}>
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
        </OverviewGrid>
      </Section>

      <Section>
        <Section.Title>{grant.recordsTitle}</Section.Title>
        {/* jscpd:ignore-start — 组合式 Table 页内拼装（禁再抽薄包装） */}
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
        <FaqList items={grant.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
