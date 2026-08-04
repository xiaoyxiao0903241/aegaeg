import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
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
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{grant.dataTitle}</DappContentHeading>
        <OverviewGrid className="mt-4" columns={2}>
          {overviewTiles.map((item) => (
            <Tile key={item.key} label={item.label}>
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
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{grant.recordsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          footer={
            shouldShowTablePagination(recordsTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={recordsTotal}
              />
            ) : undefined
          }
          header={rewardsRecordsPillTabsHeader({
            ariaLabel: grant.recordsTabsAria,
            options: recordsTabOptions,
            value: recordsTab,
            onChange: (next) => setRecordsTab(next as typeof recordsTab),
          })}
        >
          <DappTableBody
            colWidths={
              isIssue
                ? ['10rem', '8.75rem', '3.75rem', '8.125rem', '4.375rem', '1fr']
                : ['11.875rem', '10rem', '1fr']
            }
            emphasisColumns={[1]}
            emptyTitle={isIssue ? grant.emptyIssue : grant.emptyClaim}
            headers={[...(isIssue ? grant.issueColumns : grant.claimColumns)]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{grant.faq.title}</DappContentHeading>
        <FaqList items={grant.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
