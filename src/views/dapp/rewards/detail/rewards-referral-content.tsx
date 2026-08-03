import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { FaqList } from '~/shared/ui/faq-list'
import { useRewardsReferralContentView } from '~/views/dapp/rewards/detail/use-rewards-referral-content-view'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'

export function RewardsReferralContent() {
  const {
    referral,
    totalRewards,
    myPosition,
    referralCount,
    contributionValue,
    nextPayout,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    referralRows,
    referralsLoading,
    referralsPage,
    setReferralsPage,
    referralsTotal,
  } = useRewardsReferralContentView()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{referral.dataTitle}</DappContentHeading>
        {/* Figma 4404:223 · reuse:RewardsStatCard · 3+2 */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard label={referral.totalRewards} value={totalRewards} />
          <RewardsStatCard label={referral.myPosition} value={myPosition} />
          <RewardsStatCard label={referral.directCount} value={referralCount} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <RewardsStatCard
            label={referral.contribution}
            value={contributionValue}
            valueHint={referral.contributionHint}
          />
          <RewardsStatCard label={referral.nextPayout} value={nextPayout} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.recordsTitle}</DappContentHeading>
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
            emptyTitle={referral.emptyRecords}
            headers={[...referral.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          footer={
            shouldShowTablePagination(referralsTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setReferralsPage}
                page={referralsPage}
                total={referralsTotal}
              />
            ) : undefined
          }
        >
          <DappTableBody
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            emphasisColumns={[2]}
            emptyTitle={referral.emptyReferrals}
            headers={[...referral.referralsColumns]}
            isLoading={referralsLoading}
            rows={referralRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.faq.title}</DappContentHeading>
        <FaqList items={referral.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
