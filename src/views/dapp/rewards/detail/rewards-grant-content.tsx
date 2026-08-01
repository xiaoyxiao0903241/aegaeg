import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { FaqList } from '~/shared/ui/faq-list'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'
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
                ? ['160px', '140px', '60px', '130px', '70px', '1fr']
                : ['190px', '160px', '1fr']
            }
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
