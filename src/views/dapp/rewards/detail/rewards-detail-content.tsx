import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

export function RewardsDetailContent({ view }: { view: Exclude<RewardsView, 'hub'> }) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id={`rewards-${view}-title`}>{card.title}</DappContentHeading>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="copy">
          {card.aside}
        </Text>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.claimHistory.title}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['200px', '140px', '160px', '1fr']}
            headers={[...t.rewards.claimHistory.columns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.rewards.claimHistory.empty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.faq.title}</DappContentHeading>
        <FaqList items={t.rewards.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
