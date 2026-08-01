import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsCobuildContentView } from '~/views/dapp/rewards/detail/use-rewards-cobuild-content-view'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'

export function RewardsCobuildContent() {
  const {
    cobuild,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    totalRewards,
    totalPerformance,
    myPosition,
    nextPayout,
    tierCurrent,
    tierNext,
    reqHolding,
    reqAccounts,
    reqPerformance,
    recordRows,
    recordsLoading,
    directRows,
    directsLoading,
    recordsTabOptions,
  } = useRewardsCobuildContentView()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{cobuild.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard label={cobuild.totalRewards} value={totalRewards} />
          <RewardsStatCard label={cobuild.totalPerformance} value={totalPerformance} />
          <RewardsStatCard label={cobuild.myPosition} value={myPosition} />
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
          <RewardsStatCard label={cobuild.nextPayout} value={nextPayout} />
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
                {tierCurrent}
              </Text>
            </div>
            <div className="text-right">
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.tierNext}
              </Text>
              <Text as="p" className="mt-1 font-semibold" variant="copy">
                {tierNext}
              </Text>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(
              [
                [cobuild.reqHolding, cobuild.reqHoldingHint, reqHolding],
                [cobuild.reqAccounts, cobuild.reqAccountsHint, reqAccounts],
                [cobuild.reqPerformance, cobuild.reqPerformanceHint, reqPerformance],
              ] as const
            ).map(([label, hint, value]) => (
              <div className="rounded-2xl border border-border p-4" key={label}>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {label}
                </Text>
                <Text as="p" className="mt-2 font-semibold" variant="copy">
                  {value}
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
          header={rewardsRecordsPillTabsHeader({
            ariaLabel: cobuild.recordsTabsAria,
            options: recordsTabOptions,
            value: recordsTab,
            onChange: (next) => setRecordsTab(next as typeof recordsTab),
          })}
        >
          <ResponsiveTable
            colWidths={['190px', '70px', '140px', '110px', '1fr']}
            headers={[...cobuild.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          {!recordsLoading && recordRows.length === 0 ? (
            <DappTableEmptyMessage
              embedded
              title={
                recordsTab === 'cobuild'
                  ? cobuild.emptyRecordsCobuild
                  : cobuild.emptyRecordsEqualize
              }
            />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.directsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '200px', '130px', '1fr']}
            headers={[...cobuild.directsColumns]}
            isLoading={directsLoading}
            rows={directRows}
          />
          {!directsLoading && directRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={cobuild.emptyDirects} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.faq.title}</DappContentHeading>
        <FaqList items={cobuild.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
