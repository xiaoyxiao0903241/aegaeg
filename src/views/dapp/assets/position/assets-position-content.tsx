import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useI18n } from '~/i18n/use-i18n'
import { AssetsProductDetailSections } from '~/views/dapp/assets/assets-product-detail-sections'
import type { AssetsProduct } from '~/views/dapp/assets/position/assets-position-widget'
import { useAssetsPositionOpsRows } from '~/views/dapp/assets/position/use-assets-position-ops-rows'
import { useAssetsPositionStats } from '~/views/dapp/assets/position/use-assets-position-stats'

export function AssetsPositionContent({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const copy = t.assets.products[product]
  const stats = copy.stats
  const values = useAssetsPositionStats(product)
  const ops = useAssetsPositionOpsRows(product)

  return (
    <DappDetailPage>
      <AssetsProductDetailSections
        faqItems={copy.faq.items}
        faqTitle={copy.faq.title}
        metrics={stats.metrics}
        metricsGridClassName={
          product === 'stake'
            ? 'grid grid-cols-2 gap-3 dapp:grid-cols-3'
            : // LP/Burn：上 3 下 2（Figma 250 / 384）；6 列 + col-span 合成
              'grid grid-cols-2 gap-3 dapp:grid-cols-6 dapp:[&>*]:col-span-2 dapp:[&>*:nth-child(n+4)]:col-span-3'
        }
        opsColumns={t.assets.opsColumns}
        opsEmpty={copy.ops.empty}
        opsLoading={ops.isLoading}
        opsRows={ops.rows}
        opsTitle={copy.ops.title}
        statsTitle={stats.title}
        values={values}
      />
    </DappDetailPage>
  )
}
