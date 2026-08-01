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
import { Text } from '~/shared/ui/text'
import { BurnExchangeHistorySection } from '~/views/dapp/exchange/burn/burn-exchange-history-section'
import { ExchangeMetricCard } from '~/views/dapp/exchange/exchange-detail-primitives'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'

const USD1_DECIMALS = 18
/** FAQ index — 「销毁的 AGX 去了哪里？」 uses live getSplitConfig. */
const FAQ_DESTINATION_INDEX = 3

export function BurnExchangeContent({ burn }: { burn: BurnExchangeState }) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const agxPriceQuery = usePresaleAgxPriceQuery()

  const decimals = burn.config?.decimals ?? EXCHANGE_CONFIG.tokens.agx.decimals
  const walletReady = sessionReady && burn.walletReady

  const totalBurnedAgx = walletReady
    ? (burn.userStats?.agxBurned ?? 0n)
    : (burn.config?.totalBurned ?? 0n)

  const totalEarnedContribution = walletReady
    ? (burn.userStats?.contributionEarned ?? 0n)
    : (burn.config?.totalContribution ?? 0n)

  const totalConsumedContribution = walletReady
    ? (burn.userStats?.contributionConsumed ?? 0n)
    : null

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

  const faqItems = useMemo(() => {
    const items = t.exchange.burn.faq.items
    const splitBps = burn.config?.splitBps
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
  }, [burn.config?.splitBps, t.exchange.burn.faq.items])

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          <ExchangeMetricCard
            label={t.exchange.burn.burnRate}
            value={burn.overviewRateLabel || '0'}
          />
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
        <DappContentHeading>{t.exchange.burn.aboutTitle}</DappContentHeading>
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'agx']} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.burn.history.title}</DappContentHeading>
        <BurnExchangeHistorySection />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList items={faqItems} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
