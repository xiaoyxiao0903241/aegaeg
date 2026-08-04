import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { FaqList } from '~/shared/components/faq-list'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsGrantContentView } from '~/views/dapp/rewards/detail/use-rewards-grant-content-view'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'

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

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{grant.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <RewardsStatCard label={grant.tier} value={tier} />
          <RewardsStatCard label={grant.totalClaimed} value={totalClaimed} />
        </div>
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
