import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
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
          <RewardsStatCard label={participate.contribution}>
            <Text as="p" tone="muted-foreground" variant="caption">
              {participate.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {participate.contributionHint}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={participate.nextPayout} value={nextPayout} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['11.875rem', '10rem', '10rem', '1fr']}
            headers={[...participate.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          {!recordsLoading && recordRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={participate.emptyRecords} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.inviterTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            headers={[...participate.inviterColumns]}
            isLoading={inviterLoading}
            rows={inviterRows}
          />
          {!inviterLoading && inviterRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={participate.emptyInviter} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.faq.title}</DappContentHeading>
        <FaqList items={participate.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
