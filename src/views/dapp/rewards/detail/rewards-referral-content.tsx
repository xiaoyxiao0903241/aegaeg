import { useQuery } from '@tanstack/react-query'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readReferralCount } from '~/web3/referral/referral-read'
import { REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'
import { useRewardsContributionDisplay } from '~/views/dapp/rewards/use-rewards-contribution-display'

export function RewardsReferralContent() {
  const { messages: t } = useI18n()
  const referral = t.rewards.referral
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const { contributionValue } = useRewardsContributionDisplay(walletReady)

  const countQuery = useQuery({
    queryKey: queryKeys.chain.rewardsReferralCount(address ?? ''),
    queryFn: () => readReferralCount(address as Address, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const referralCount =
    !walletReady || !address
      ? REWARDS_DASH
      : countQuery.isPending
        ? '…'
        : countQuery.data != null
          ? String(countQuery.data)
          : REWARDS_DASH

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{referral.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard label={referral.totalRewards} value={REWARDS_DASH} />
          <RewardsStatCard label={referral.myPosition} value={REWARDS_DASH} />
          <RewardsStatCard label={referral.directCount} value={referralCount} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <RewardsStatCard label={referral.contribution}>
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {referral.contributionHint}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={referral.nextPayout} value={REWARDS_DASH} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...referral.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={referral.emptyRecords} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '170px', '110px', '1fr']}
            headers={[...referral.referralsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={referral.emptyReferrals} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.faq.title}</DappContentHeading>
        <FaqList items={referral.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
