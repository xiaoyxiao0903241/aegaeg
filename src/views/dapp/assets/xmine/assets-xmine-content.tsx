import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { useAssetsXmineStats } from '~/views/dapp/assets/xmine/use-assets-xmine-stats'

export function AssetsXmineContent() {
  const { messages: t } = useI18n()
  const copy = t.assets.products.xmine
  const values = useAssetsXmineStats()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{copy.stats.title}</DappContentHeading>
        <div className="grid grid-cols-2 gap-3 dapp:grid-cols-3">
          {copy.stats.metrics.map((metric, index) => (
            <div className="grid gap-1" key={metric.label}>
              <Text as="span" tone="muted-foreground" variant="detail">
                {metric.label}
              </Text>
              <Text as="strong" className="font-semibold" variant="copy">
                {values[index] ?? '—'}
              </Text>
            </div>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{copy.ops.title}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['200px', '150px', '180px', '1fr']}
            headers={[...t.assets.opsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={copy.ops.empty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{copy.faq.title}</DappContentHeading>
        <FaqList items={copy.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
