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
import { REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'
import { useRewardsContributionDisplay } from '~/views/dapp/rewards/use-rewards-contribution-display'

export function RewardsParticipateContent() {
  const { messages: t } = useI18n()
  const participate = t.rewards.participate
  const { walletReady } = useDappShell()
  const { contributionValue } = useRewardsContributionDisplay(walletReady)

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{participate.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <RewardsStatCard label={participate.totalRewards} value={REWARDS_DASH} />
          <RewardsStatCard label={participate.myPosition} value={REWARDS_DASH} />
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
          <RewardsStatCard label={participate.nextPayout} value={REWARDS_DASH} />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...participate.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={participate.emptyRecords} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.inviterTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '170px', '110px', '1fr']}
            headers={[...participate.inviterColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={participate.emptyInviter} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.faq.title}</DappContentHeading>
        <FaqList items={participate.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
