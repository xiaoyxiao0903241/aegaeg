import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { tokenCarouselIcons } from '~/app/assets'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import type { AssetsProduct } from '~/views/dapp/assets/position/assets-position-widget'
import { useAssetsPositionStats } from '~/views/dapp/assets/position/use-assets-position-stats'

export function AssetsPositionContent({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const copy = t.assets.products[product]
  const stats = copy.stats
  const values = useAssetsPositionStats(product)

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{stats.title}</DappContentHeading>
        <div className="grid grid-cols-2 gap-3 dapp:grid-cols-3">
          {stats.metrics.map((metric, index) => {
            const cell = values[index]
            const iconSrc =
              cell?.icon === 'agx'
                ? tokenCarouselIcons.agxIcon
                : cell?.icon === 'gagx'
                  ? tokenCarouselIcons.gagxIcon
                  : null
            return (
              <div className="grid gap-1.5 rounded-2xl bg-card p-4 shadow-card" key={metric.label}>
                <Text as="span" className="font-medium" tone="muted-foreground" variant="detail">
                  {metric.label}
                </Text>
                <div className="flex items-center gap-2">
                  {iconSrc ? (
                    <DappIcon
                      alt=""
                      className="size-[18px] rounded-[10px]"
                      size="sm"
                      src={iconSrc}
                    />
                  ) : null}
                  <Text as="strong" className="text-base font-semibold" variant="copy">
                    {cell?.value ?? '—'}
                  </Text>
                </div>
                {cell?.approx != null ? (
                  <Text as="span" tone="muted-foreground" variant="detail">
                    {cell.approx}
                  </Text>
                ) : null}
              </div>
            )
          })}
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
