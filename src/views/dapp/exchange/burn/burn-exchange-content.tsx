import { useMemo } from 'react'

import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { MetricGrid } from '~/app/shell/metric-grid'
import { useDappShell } from '~/app/use-dapp-shell'
import { BPS_DENOM } from '~/core/exchange/bps'
import { formatBurnSplitPercent } from '~/core/exchange/burn-contribution-swap'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { FaqList } from '~/shared/ui/faq-list'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { BurnExchangeHistorySection } from '~/views/dapp/exchange/burn/burn-exchange-history-section'
import { ExchangeMetricCard } from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import type { BurnUserStats } from '~/web3/exchange/burn-exchange-read'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'

const USD1_DECIMALS = 18
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
  const agxPriceQuery = usePresaleAgxPriceQuery()

  const decimals = config?.decimals ?? EXCHANGE_CONFIG.tokens.agx.decimals
  const walletReady = sessionReady && burnWalletReady

  const totalBurnedAgx = walletReady ? (userStats?.agxBurned ?? 0n) : (config?.totalBurned ?? 0n)

  const totalEarnedContribution = walletReady
    ? (userStats?.contributionEarned ?? 0n)
    : (config?.totalContribution ?? 0n)

  const totalConsumedContribution = walletReady ? (userStats?.contributionConsumed ?? 0n) : null

  const agxPriceUsd = useMemo(() => {
    const fromChain = formatTokenAmountToNumber(agxPriceQuery.data ?? 0n, USD1_DECIMALS)
    return fromChain > 0 ? fromChain : 0
  }, [agxPriceQuery.data])

  const burnedAgxLabel = `${formatTokenAmount(totalBurnedAgx, decimals, { digits: 2, trimZeros: false })} AGX`
  const burnedUsdLabel =
    agxPriceUsd > 0
      ? formatGroupedNumber(formatTokenAmountToNumber(totalBurnedAgx, decimals) * agxPriceUsd, {
          digits: 2,
          prefix: '$',
        })
      : null

  const earnedLabel = formatTokenAmount(totalEarnedContribution, decimals, {
    digits: 2,
    trimZeros: false,
  })
  const consumedLabel =
    totalConsumedContribution != null
      ? formatTokenAmount(totalConsumedContribution, decimals, { digits: 2, trimZeros: false })
      : '0.00'

  // 稿「设置贡献点数(测试)」— UI MUST；值 = 链上当前贡献余额，只读诚实空
  const testContributionDisplay = !walletReady
    ? '—'
    : formatTokenAmount(userStats?.contributionBalance ?? 0n, decimals, {
        digits: 0,
        trimZeros: true,
      })

  const faqItems = useMemo(() => {
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
  }, [config?.splitBps, t.exchange.burn.faq.items])

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
                  ≈ {burnedUsdLabel ?? formatGroupedNumber(0, { digits: 2, prefix: '$' })}
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
        {/* Figma `4489:303` 关于 = 20 / leading 1.2 */}
        <DappContentHeading className="mb-0 pb-4 text-xl leading-[1.2] tracking-tight">
          {t.exchange.burn.aboutTitle}
        </DappContentHeading>
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'agx']} />
      </DappDetailBlock>

      <DappDetailBlock>
        {/* Figma recHead `4434:486`：标题 +「设置贡献点数(测试)」只读诚实展示（禁假写）。 */}
        <div className="mb-0 flex items-center justify-between gap-3 pb-4">
          <Text as="h2" variant="section" className="m-0">
            {t.exchange.burn.history.title}
          </Text>
          <label className="flex items-center gap-2.5">
            <Text as="span" variant="caption" className="whitespace-nowrap text-muted-foreground">
              {t.exchange.burn.history.testContribution}
            </Text>
            <Input
              aria-label={t.exchange.burn.history.testContribution}
              className="h-7 w-9 px-1.5 py-0 text-center text-(length:--type-copy-size) leading-none"
              readOnly
              value={testContributionDisplay}
            />
          </label>
        </div>
        <BurnExchangeHistorySection />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList items={faqItems} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
