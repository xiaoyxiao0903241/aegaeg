/**
 * 仓位产品详情页
 *
 * 顶部为产品统计指标，中部为操作记录表格（可分页），底部为 FAQ。
 */
import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import {
  AssetsFaqSection,
  AssetsOpsSection,
  AssetsStatsSection,
} from '~/views/dapp/assets/assets-detail-sections'
import type { AssetsProduct } from '~/views/dapp/assets/position/assets-position-widget'
import { useAssetsPositionOpsRows } from '~/views/dapp/assets/position/use-assets-position-ops-rows'
import { useAssetsPositionStats } from '~/views/dapp/assets/position/use-assets-position-stats'

export function AssetsPositionDetail({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const copy = t.assets.products[product]
  const stats = copy.stats
  const values = useAssetsPositionStats(product)
  const ops = useAssetsPositionOpsRows(product)

  return (
    <Detail>
      <AssetsStatsSection
        metrics={stats.metrics}
        metricsLayout={
          product === 'stake'
            ? 3
            : // LP/Burn 用上三下二的指标排布，与总览网格间距对齐
              'upper3-lower2'
        }
        statsTitle={stats.title}
        values={values}
      />
      <AssetsOpsSection
        opsColumns={t.assets.opsColumns}
        opsEmpty={copy.ops.empty}
        opsLoading={ops.isLoading}
        opsPagination={{
          page: ops.page,
          total: ops.sessionReady ? ops.total : 0,
          onPageChange: ops.setPage,
        }}
        opsRows={ops.rows}
        opsTitle={copy.ops.title}
      />
      <AssetsFaqSection faqItems={copy.faq.items} faqTitle={copy.faq.title} />
    </Detail>
  )
}
