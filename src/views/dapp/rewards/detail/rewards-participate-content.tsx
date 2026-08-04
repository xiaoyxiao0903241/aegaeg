import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { FaqList } from '~/shared/components/faq-list'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useRewardsParticipateContentView } from '~/views/dapp/rewards/detail/use-rewards-participate-content-view'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'

export function RewardsParticipateContent() {
  const {
    participate,
    totalRewards,
    myPosition,
    contributionValue,
    nextPayout,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    inviterRows,
    inviterLoading,
  } = useRewardsParticipateContentView()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{participate.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <RewardsStatCard label={participate.totalRewards} value={totalRewards} />
          <RewardsStatCard label={participate.myPosition} value={myPosition} />
          <RewardsStatCard
            label={participate.contribution}
            value={contributionValue}
            valueHint={participate.contributionHint}
          />
          <RewardsStatCard label={participate.nextPayout} value={nextPayout} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.recordsTitle}</DappContentHeading>
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
        >
          <DappTableBody
            colWidths={['11.875rem', '10rem', '10rem', '1fr']}
            emphasisColumns={[1]}
            emptyTitle={participate.emptyRecords}
            headers={[...participate.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.inviterTitle}</DappContentHeading>
        {/* 邀请人 API 单条 · 无分页 */}
        <DappTableCard className="mt-4">
          <DappTableBody
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            emphasisColumns={[2, 3]}
            emptyTitle={participate.emptyInviter}
            headers={[...participate.inviterColumns]}
            isLoading={inviterLoading}
            rows={inviterRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.faq.title}</DappContentHeading>
        <FaqList items={participate.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
