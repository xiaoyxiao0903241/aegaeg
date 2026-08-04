import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { MetricGrid } from '~/app/shell/metric-grid'
import { useDappShell } from '~/app/use-dapp-shell'
import { BPS_DENOM } from '~/core/exchange/bps'
import { formatBurnSplitPercent } from '~/core/exchange/burn-contribution-swap'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd } from '~/shared/api/format-display'
import { FaqList } from '~/shared/components/faq-list'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { BurnExchangeHistorySection } from '~/views/dapp/exchange/burn/burn-exchange-history-section'
import { ExchangeMetricCard } from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import type { BurnUserStats } from '~/web3/exchange/burn-exchange-read'

/** FAQ index — 「销毁的 AGX 去了哪里？」 uses live getSplitConfig. */
const FAQ_DESTINATION_INDEX = 3

/** Overview scalars — no amount draft; keystroke must not wake metrics/FAQ. */
export type BurnExchangeContentProps = {
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

export function BurnExchangeContent({
  overviewRateLabel,
  walletReady: burnWalletReady,
  config,
  userStats,
}: BurnExchangeContentProps) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const agxPriceUsd = useAgxPriceUsd()

  const decimals = config?.decimals ?? EXCHANGE_CONFIG.tokens.agx.decimals
  const walletReady = sessionReady && burnWalletReady

  const totalBurnedAgx = walletReady ? (userStats?.agxBurned ?? 0n) : (config?.totalBurned ?? 0n)

  const totalEarnedContribution = walletReady
    ? (userStats?.contributionEarned ?? 0n)
    : (config?.totalContribution ?? 0n)

  const totalConsumedContribution = walletReady ? (userStats?.contributionConsumed ?? 0n) : null

  const burnedAgxLabel = `${formatTokenAmount(totalBurnedAgx, decimals, { digits: 2, trimZeros: false })} AGX`
  // 空态 SSOT：无价 → ≈ $0.00（禁 ≈ —）
  const burnedUsdApprox = formatApproxUsd(
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
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          <ExchangeMetricCard label={t.exchange.burn.burnRate} value={overviewRateLabel || '0'} />
          <ExchangeMetricCard
            label={t.exchange.burn.metrics.totalBurnedAgx}
            value={
              <>
                {burnedAgxLabel}
                <Text as="span" variant="copy" tone="muted-foreground" className="text-xs">
                  {' '}
                  {burnedUsdApprox}
                </Text>
              </>
            }
          />
          <ExchangeMetricCard
            label={t.exchange.burn.metrics.totalEarnedContribution}
            value={earnedLabel}
          />
          <ExchangeMetricCard
            label={t.exchange.burn.metrics.totalConsumedContribution}
            value={consumedLabel}
          />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        {/* 关于标题用 headline leading token */}
        <DappContentHeading className="mb-0 pb-4 text-xl leading-(--type-headline-leading) tracking-tight">
          {t.exchange.burn.aboutTitle}
        </DappContentHeading>
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'agx']} />
      </DappDetailBlock>

      <DappDetailBlock>
        {/* 销毁记录标题；测试贡献控件不渲染 */}
        <DappContentHeading className="mb-0 pb-4">
          {t.exchange.burn.history.title}
        </DappContentHeading>
        <BurnExchangeHistorySection />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={faqItems} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
