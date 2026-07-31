import { useI18n } from '~/i18n/use-i18n'
import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { FaqList } from '~/shared/ui/faq-list'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useAssetsXmineOpsRows } from '~/views/dapp/assets/xmine/use-assets-xmine-ops-rows'
import { useAssetsXmineStats } from '~/views/dapp/assets/xmine/use-assets-xmine-stats'

export function AssetsXmineContent() {
  const { messages: t } = useI18n()
  const copy = t.assets.products.xmine
  const values = useAssetsXmineStats()
  const ops = useAssetsXmineOpsRows()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{copy.stats.title}</DappContentHeading>
        <div className="grid grid-cols-2 gap-3">
          {copy.stats.metrics.map((metric, index) => {
            const cell = values[index]
            const iconSrc =
              cell?.icon === 'gagx'
                ? tokenCarouselIcons.gagxIcon
                : cell?.icon === 'x'
                  ? tokenCarouselIcons.xIcon
                  : null
            return (
              <Card
                as="div"
                surface="elevated"
                className="grid gap-1.5 rounded-2xl p-4"
                key={metric.label}
              >
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
              </Card>
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
            rows={ops.rows}
          />
          {ops.rows.length === 0 ? (
            <DappTableEmptyMessage embedded title={ops.isLoading ? '…' : copy.ops.empty} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{copy.faq.title}</DappContentHeading>
        <FaqList items={copy.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
