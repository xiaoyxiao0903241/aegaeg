import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { AssetsProductDetailSections } from '~/views/dapp/assets/assets-product-detail-sections'
import { useAssetsXmineOpsRows } from '~/views/dapp/assets/xmine/use-assets-xmine-ops-rows'
import { useAssetsXmineStats } from '~/views/dapp/assets/xmine/use-assets-xmine-stats'

export function AssetsXmineContent() {
  const { messages: t } = useI18n()
  const copy = t.assets.products.xmine
  const values = useAssetsXmineStats()
  const ops = useAssetsXmineOpsRows()

  return (
    <DappDetailPage>
      <AssetsProductDetailSections
        faqItems={copy.faq.items}
        faqTitle={copy.faq.title}
        metrics={copy.stats.metrics}
        opsColumns={t.assets.opsColumns}
        opsEmpty={copy.ops.empty}
        opsLoading={ops.isLoading}
        opsRows={ops.rows}
        opsTitle={copy.ops.title}
        statsTitle={copy.stats.title}
        values={values}
      />
    </DappDetailPage>
  )
}
