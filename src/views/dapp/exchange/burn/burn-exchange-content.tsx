import { useMemo } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { MetricGrid } from '~/app/shell/metric-grid'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { formatUsd } from '~/shared/api/format-display'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeMetricCard,
  ExchangeMetricCardSkeleton,
} from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { BurnExchangeHistorySection } from '~/views/dapp/exchange/burn/burn-exchange-history-section'
import { useDappShell } from '~/app/use-dapp-shell'

const USD1_DECIMALS = 18

export function BurnExchangeContent({ burn }: { burn: BurnExchangeState }) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const showRateSkeleton = burn.isExchangePriceQuoting && !burn.overviewRateLabel

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

  const burnedAgxLabel = `${formatTokenAmount(totalBurnedAgx, decimals, 2)} AGX`
  const burnedUsdLabel =
    agxPriceUsd > 0
      ? formatUsd(formatTokenAmountToNumber(totalBurnedAgx, decimals) * agxPriceUsd, 2)
      : null

  const earnedLabel = formatTokenAmount(totalEarnedContribution, decimals, 2)
  const consumedLabel =
    totalConsumedContribution != null
      ? formatTokenAmount(totalConsumedContribution, decimals, 2)
      : '—'

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          {showRateSkeleton ? (
            <ExchangeMetricCardSkeleton />
          ) : (
            <ExchangeMetricCard
              label={t.exchange.burn.burnRate}
              value={burn.overviewRateLabel || '—'}
            />
          )}
          <ExchangeMetricCard
            label={t.exchange.burn.metrics.totalBurnedAgx}
            value={
              <>
                {burnedAgxLabel}
                {burnedUsdLabel ? (
                  <Text as="span" variant="copy" tone="muted-foreground" className="text-xs">
                    {' '}
                    ≈ {burnedUsdLabel}
                  </Text>
                ) : null}
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
        <FaqList defaultOpenFirst={false} items={t.exchange.burn.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
