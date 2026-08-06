/**
 * 销毁详情页
 *
 * 概览区展示销毁率、累计销毁 AGX 与贡献点统计，下方为代币
 * 介绍轮播、销毁记录与 FAQ；未连接钱包时统计展示全局累计值。
 */
import { BPS_DENOM } from '~/core/exchange/bps'
import { formatBurnSplitPercent } from '~/core/exchange/burn-contribution-swap'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { formatUsdApprox } from '~/shared/api/format-display'
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
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useBurnHistory } from '~/views/dapp/exchange/burn/use-burn'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/primitives'
import type { BurnUserStats } from '~/web3/exchange/burn-exchange-read'

// 「销毁的 AGX 去了哪里？」FAQ 的销毁 / 注入比例来自链上 splitBps
const FAQ_DESTINATION_INDEX = 3

/** 详情页只接收概览标量，不承载金额输入。 */
export type BurnExchangeDetailProps = {
  overviewRateLabel: string
  walletReady: boolean
  config:
    | {
        decimals: number
        totalBurned: bigint
        totalContribution: bigint
        splitBps: bigint
      }
    | undefined
  userStats: BurnUserStats | undefined
}

export function BurnExchangeDetail({
  overviewRateLabel,
  walletReady: burnWalletReady,
  config,
  userStats,
}: BurnExchangeDetailProps) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const agxPriceUsd = useAgxPriceUsd()
  const history = useBurnHistory()

  const decimals = config?.decimals ?? EXCHANGE_CONFIG.tokens.agx.decimals
  const walletReady = sessionReady && burnWalletReady

  const totalBurnedAgx = walletReady ? (userStats?.agxBurned ?? 0n) : (config?.totalBurned ?? 0n)

  const totalEarnedContribution = walletReady
    ? (userStats?.contributionEarned ?? 0n)
    : (config?.totalContribution ?? 0n)

  const totalConsumedContribution = walletReady ? (userStats?.contributionConsumed ?? 0n) : null

  const burnedAgxLabel = `${formatTokenAmount(totalBurnedAgx, decimals, { digits: 2, trimZeros: false })} AGX`
  // 空态统一：无价格时显示 ≈ $0.00（不显示 ≈ —）
  const burnedUsdApprox = formatUsdApprox(
    formatTokenAmountToNumber(totalBurnedAgx, decimals),
    agxPriceUsd != null && agxPriceUsd > 0 ? agxPriceUsd : null,
  )

  const earnedLabel = formatTokenAmount(totalEarnedContribution, decimals, {
    digits: 2,
    trimZeros: false,
  })
  const consumedLabel =
    totalConsumedContribution != null
      ? formatTokenAmount(totalConsumedContribution, decimals, { digits: 2, trimZeros: false })
      : '0.00'

  const faqItems = (() => {
    const items = t.exchange.burn.faq.items
    const splitBps = config?.splitBps
    const burnPct = splitBps === undefined ? '0' : formatBurnSplitPercent(splitBps)
    const injectPct = splitBps === undefined ? '0' : formatBurnSplitPercent(BPS_DENOM - splitBps)
    return items.map((item, index) =>
      index === FAQ_DESTINATION_INDEX
        ? {
            ...item,
            a: item.a.replace('{burnPct}', burnPct).replace('{injectPct}', injectPct),
          }
        : item,
    )
  })()

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
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'agx']} />
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
            colWidths={[...history.colWidths]}
            empty={history.emptyTitle}
            headers={history.headers}
            isLoading={history.isLoading}
            rows={history.rows}
          />
          {shouldShowTablePagination(history.total) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={history.setPage}
                page={history.page}
                total={history.total}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={faqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
