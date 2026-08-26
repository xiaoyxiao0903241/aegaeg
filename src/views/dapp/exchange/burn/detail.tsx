/**
 * 销毁详情页
 *
 * 累计销毁 AGX 走 `/agx-contribution/summary` 的 total_burned_agx（个人投影）。
 * 获得/已消耗贡献仍走链上 userStats。未登录或缺数显 0，不绑 getConfig().total*。
 * 关于区走共用 TokenAboutCarousel，只传贡献点数一张卡。
 */
import { ZERO_BI } from '~/core/constants'
import {
  formatContributionConsumedTotal,
  formatContributionPoints,
} from '~/core/exchange/format-contribution-points'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useAgxContributionSummary } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { ChipTabs } from '~/shared/components/chip-tabs'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatApiAmount, formatUsdApprox, parseApiAmount } from '~/shared/presenters/format'
import { useBurnHistory } from '~/views/dapp/exchange/burn/use-burn'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/primitives'
import type { BurnUserStats } from '~/web3/exchange/burn-exchange-read'

/** 详情页只接收概览标量，不承载金额输入。 */
export type BurnExchangeDetailProps = {
  overviewRateLabel: string
  config:
    | {
        decimals: number
        splitBps: bigint
      }
    | undefined
  userStats: BurnUserStats | undefined
}

export function BurnExchangeDetail({
  overviewRateLabel,
  config,
  userStats,
}: BurnExchangeDetailProps) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const agxPriceUsd = useAgxPriceUsd()
  const contributionSummary = useAgxContributionSummary(sessionReady)
  const history = useBurnHistory()

  const decimals = config?.decimals ?? EXCHANGE_CONFIG.tokens.agx.decimals

  const burnedRaw = contributionSummary.data?.total_burned_agx
  const burnedAgxLabel = formatApiAmount(burnedRaw, { digits: 2, suffix: ' AGX' })
  const burnedUsdApprox = formatUsdApprox(
    parseApiAmount(burnedRaw) ?? 0,
    agxPriceUsd != null && agxPriceUsd > 0 ? agxPriceUsd : null,
  )
  const totalEarnedContribution = userStats?.contributionEarned ?? ZERO_BI
  const totalConsumedContribution = userStats?.contributionConsumed ?? ZERO_BI

  const earnedLabel = formatContributionPoints(totalEarnedContribution, decimals)
  const consumedLabel = formatContributionConsumedTotal(totalConsumedContribution, decimals)

  return (
    <Detail>
      <Section>
        <Section.Title id="exchange-title">{t.exchange.overview}</Section.Title>
        <Grid columns={2}>
          {(
            [
              { key: 'rate', label: t.exchange.burn.burnRate, value: overviewRateLabel },
              {
                key: 'burned',
                label: t.exchange.burn.metrics.totalBurnedAgx,
                value: burnedAgxLabel,
                valueHint: burnedUsdApprox || undefined,
              },
              {
                key: 'earned',
                label: t.exchange.burn.metrics.totalEarnedContribution,
                value: earnedLabel,
              },
              {
                key: 'consumed',
                label: t.exchange.burn.metrics.totalConsumedContribution,
                value: consumedLabel,
              },
            ] as const
          ).map((item) => (
            <Tile key={item.key}>
              <Tile.Label>{item.label}</Tile.Label>
              <Text
                as="strong"
                className="text-base/5 font-semibold tracking-normal"
                variant="headline"
              >
                {'valueHint' in item && item.valueHint != null ? (
                  <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                    <CountValue text={item.value} />
                    <Text as="span" className="text-xs" tone="muted-foreground" variant="copy">
                      {item.valueHint}
                    </Text>
                  </span>
                ) : (
                  <CountValue text={item.value} />
                )}
              </Text>
            </Tile>
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.exchange.burn.aboutTitle}</Section.Title>
        <TokenAboutCarousel cardKeys={['contribution']} />
      </Section>

      <Section>
        {/* 销毁记录标题；测试贡献控件不渲染 */}
        <Section.Title>{t.exchange.burn.history.title}</Section.Title>
        <Table>
          <Table.Header>
            <ChipTabs
              activeTone="coral"
              ariaLabel={history.t.exchange.burn.history.tabsAriaLabel}
              className="flex items-center justify-start gap-2 [&_button]:h-6 [&_button]:min-h-6 [&_button]:py-0"
              items={history.tabOptions.map((option) => ({
                active: option.value === history.tab,
                label: option.label,
              }))}
              onSelect={(index) => {
                const next = history.tabOptions[index]
                if (next) history.setTab(next.value)
              }}
              size="md"
            />
          </Table.Header>
          <Table.Body
            emphasisColumns={history.tab === 'burn' ? [2] : [1]}
            empty={history.emptyTitle}
            headers={history.headers}
            isLoading={history.isLoading}
            mutedColumns={[0]}
            rows={history.rows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={history.setPage}
              page={history.page}
              total={history.total}
            />
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={t.exchange.burn.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
