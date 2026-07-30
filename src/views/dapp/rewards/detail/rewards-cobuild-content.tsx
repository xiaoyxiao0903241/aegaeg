import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
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

type CobuildRecordsTab = 'cobuild' | 'equalize'

export function RewardsCobuildContent() {
  const { messages: t } = useI18n()
  const cobuild = t.rewards.cobuild
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const [recordsTab, setRecordsTab] = useState<CobuildRecordsTab>('cobuild')
  const { contributionValue } = useRewardsContributionDisplay(walletReady)

  const countQuery = useQuery({
    queryKey: queryKeys.chain.rewardsCobuildCount(address ?? ''),
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

  const recordsTabOptions: Array<{ label: string; value: CobuildRecordsTab }> = [
    { label: cobuild.recordsTabCobuild, value: 'cobuild' },
    { label: cobuild.recordsTabEqualize, value: 'equalize' },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{cobuild.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard label={cobuild.totalRewards} value={REWARDS_DASH} />
          <RewardsStatCard label={cobuild.totalPerformance} value={REWARDS_DASH} />
          <RewardsStatCard label={cobuild.myPosition} value={REWARDS_DASH} />
          <RewardsStatCard label={cobuild.directCount} value={referralCount} />
          <RewardsStatCard label={cobuild.contribution}>
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.contributionHint}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={cobuild.nextPayout} value={REWARDS_DASH} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.tierTitle}</DappContentHeading>
        <RewardsStatCard className="mt-4 p-5" label={cobuild.tierCurrent}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.tierCurrent}
              </Text>
              <Text as="p" className="mt-1" variant="figure">
                {t.rewards.hub.stats.tierEmpty}
              </Text>
            </div>
            <div className="text-right">
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.tierNext}
              </Text>
              <Text as="p" className="mt-1 font-semibold" variant="copy">
                {REWARDS_DASH}
              </Text>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(
              [
                [cobuild.reqHolding, cobuild.reqHoldingHint],
                [cobuild.reqAccounts, cobuild.reqAccountsHint],
                [cobuild.reqPerformance, cobuild.reqPerformanceHint],
              ] as const
            ).map(([label, hint]) => (
              <div className="rounded-2xl border border-border p-4" key={label}>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {label}
                </Text>
                <Text as="p" className="mt-2 font-semibold" variant="copy">
                  {REWARDS_DASH}
                </Text>
                <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
                  {hint}
                </Text>
              </div>
            ))}
          </div>
        </RewardsStatCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.recordsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          header={
            <DappPillTabs
              activeTone="coral"
              ariaLabel={cobuild.recordsTabsAria}
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
            colWidths={['190px', '70px', '140px', '110px', '1fr']}
            headers={[...cobuild.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage
            embedded
            title={
              recordsTab === 'cobuild' ? cobuild.emptyRecordsCobuild : cobuild.emptyRecordsEqualize
            }
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.directsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '200px', '130px', '1fr']}
            headers={[...cobuild.directsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={cobuild.emptyDirects} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.faq.title}</DappContentHeading>
        <FaqList items={cobuild.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
