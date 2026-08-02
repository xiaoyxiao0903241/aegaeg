import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
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
    referralRows,
    referralsLoading,
  } = useRewardsReferralContentView()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{referral.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard
            className="min-h-19.25"
            label={referral.totalRewards}
            value={totalRewards}
          />
          <RewardsStatCard className="min-h-19.25" label={referral.myPosition} value={myPosition} />
          <RewardsStatCard
            className="min-h-19.25"
            label={referral.directCount}
            value={referralCount}
          />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <RewardsStatCard className="min-h-19.25" label={referral.contribution}>
            <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
              {referral.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="leading-5 font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
                {referral.contributionHint}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard className="min-h-19.25" label={referral.nextPayout} value={nextPayout} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <DappTableBody
            colWidths={['11.875rem', '10rem', '10rem', '1fr']}
            emptyTitle={referral.emptyRecords}
            headers={[...referral.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <DappTableBody
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
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
