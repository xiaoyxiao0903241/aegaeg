/**
 * X 挖矿详情页
 *
 * 顶部为挖矿统计数字，中部为操作记录表格，底部为常见问题。
 */
import { useI18n } from '~/i18n/use-i18n'
import { tokenCarouselIcons } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { Tooltip } from '~/shared/components/tooltip'
import { AssetsOpsTable } from '~/views/dapp/assets/primitives'
import { useAssetsXmineOpsRows, useAssetsXmineStats } from '~/views/dapp/assets/xmine/use-xmine'

export function XmineDetail() {
  const { messages: t } = useI18n()
  const copy = t.assets.products.xmine
  const values = useAssetsXmineStats()
  const ops = useAssetsXmineOpsRows()

  return (
    <Detail>
      <Section>
        <Section.Title>{copy.stats.title}</Section.Title>
        {/* jscpd:ignore-start — 右栏指标瓦页内同构 map */}
        <Grid columns={2} stackOnDapp>
          {copy.stats.metrics.map((metric, index) => {
            const cell = values[index]
            const iconSrc =
              cell?.icon === 'gagx'
                ? tokenCarouselIcons.gagxIcon
                : cell?.icon === 'x'
                  ? tokenCarouselIcons.xIcon
                  : null
            return (
              <Tile key={metric.label}>
                <Tile.Label>
                  {metric.label}
                  {'hint' in metric && metric.hint ? <Tooltip.Info content={metric.hint} /> : null}
                </Tile.Label>
                <div className="flex min-w-0 items-center gap-1.5">
                  {iconSrc ? (
                    <Icon alt="" className="rounded-control" size="lg" src={iconSrc} />
                  ) : null}
                  <Text
                    as="strong"
                    className="min-w-0 text-base/5 font-semibold wrap-break-word"
                    variant="copy"
                  >
                    <CountValue text={cell?.value ?? '0.0000'} />
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
          rows={ops.rows}
        />
      </Section>
      <Section>
        <Section.Title>{copy.faq.title}</Section.Title>
        <Faq items={copy.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
