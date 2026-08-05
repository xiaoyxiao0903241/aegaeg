/**
 * X 挖矿详情页
 *
 * 顶部为挖矿统计指标，中部为操作记录表格，底部为 FAQ。
 */
import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import {
  AssetsFaqSection,
  AssetsOpsSection,
  AssetsStatsSection,
} from '~/views/dapp/assets/assets-detail-sections'
import { useAssetsXmineOpsRows } from '~/views/dapp/assets/xmine/use-assets-xmine-ops-rows'
import { useAssetsXmineStats } from '~/views/dapp/assets/xmine/use-assets-xmine-stats'

export function AssetsXmineDetail() {
  const { messages: t } = useI18n()
  const copy = t.assets.products.xmine
  const values = useAssetsXmineStats()
  const ops = useAssetsXmineOpsRows()

  return (
    <Detail>
      <AssetsStatsSection
        metrics={copy.stats.metrics}
        metricsLayout={2}
        statsTitle={copy.stats.title}
        values={values}
      />
      <AssetsOpsSection
        opsColumns={t.assets.opsColumns}
        opsEmpty={copy.ops.empty}
        opsLoading={ops.isLoading}
        opsRows={ops.rows}
        opsTitle={copy.ops.title}
      />
      <AssetsFaqSection faqItems={copy.faq.items} faqTitle={copy.faq.title} />
    </Detail>
  )
}
