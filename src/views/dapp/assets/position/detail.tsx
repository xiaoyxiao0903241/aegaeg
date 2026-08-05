/**
 * 仓位产品详情页
 *
 * 顶部为产品统计数字，中部为操作记录表格（可分页），底部为常见问题。
 */
import { tokenCarouselIcons } from '~/app/assets'
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import {
  type AssetsProduct,
  useAssetsPositionOpsRows,
  useAssetsPositionStats,
} from '~/views/dapp/assets/position/use-position'
import { AssetsOpsTable } from '~/views/dapp/assets/primitives'

export function PositionDetail({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const copy = t.assets.products[product]
  const stats = copy.stats
  const values = useAssetsPositionStats(product)
  const ops = useAssetsPositionOpsRows(product)
  const columns = product === 'stake' ? 3 : 'upper3-lower2'

  return (
    <Detail>
      <Section>
        <Section.Title>{stats.title}</Section.Title>
        {/* jscpd:ignore-start — 右栏指标瓦页内同构 map */}
        <Grid columns={columns}>
          {stats.metrics.map((metric, index) => {
            const cell = values[index]
            const iconSrc =
              cell?.icon === 'agx'
                ? tokenCarouselIcons.agxIcon
                : cell?.icon === 'gagx'
                  ? tokenCarouselIcons.gagxIcon
                  : null
            return (
              <Tile key={metric.label}>
                <Tile.Label>{metric.label}</Tile.Label>
                <div className="flex items-center gap-1.5">
                  {iconSrc ? (
                    <Icon alt="" className="rounded-control" size="lg" src={iconSrc} />
                  ) : null}
                  <Text as="strong" className="text-base/5 font-semibold" variant="copy">
                    <CountValue text={cell?.value ?? '0.00'} />
                  </Text>
                </div>
                {cell?.approx != null ? (
                  <Tile.Note>
                    <CountValue text={cell.approx} />
                  </Tile.Note>
                ) : null}
              </Tile>
            )
          })}
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>
      <Section>
        <Section.Title>{copy.ops.title}</Section.Title>
        <AssetsOpsTable
          empty={copy.ops.empty}
          headers={t.assets.opsColumns}
          isLoading={ops.isLoading}
          pagination={{
            page: ops.page,
            total: ops.sessionReady ? ops.total : 0,
            onPageChange: ops.setPage,
          }}
          rows={ops.rows}
        />
      </Section>
      <Section>
        <Section.Title>{copy.faq.title}</Section.Title>
        <Faq items={[...copy.faq.items]} variant="dapp" />
      </Section>
    </Detail>
  )
}
