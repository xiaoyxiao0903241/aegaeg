import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { FaqList } from '~/shared/ui/faq-list'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'
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
          header={
            <DappPillTabs
              activeTone="coral"
              ariaLabel={grant.recordsTabsAria}
              className="flex items-center justify-start gap-2"
              items={recordsTabOptions.map((option) => ({
                active: option.value === recordsTab,
                label: option.label,
              }))}
              onSelect={(index) => {
                const next = recordsTabOptions[index]
                if (next) setRecordsTab(next.value)
              }}
            />
          }
        >
          <ResponsiveTable
            colWidths={
              isIssue
                ? ['160px', '140px', '60px', '130px', '70px', '1fr']
                : ['190px', '160px', '1fr']
            }
            headers={[...(isIssue ? grant.issueColumns : grant.claimColumns)]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          {!recordsLoading && recordRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={isIssue ? grant.emptyIssue : grant.emptyClaim} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{grant.faq.title}</DappContentHeading>
        <FaqList items={grant.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
