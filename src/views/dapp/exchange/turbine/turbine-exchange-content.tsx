import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeMetricCard,
  ExchangeMetricCardSkeleton,
} from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { DappIcon } from '~/app/shell/dapp-icon'
import { dappAssets } from '~/app/assets'
import { cn } from '~/shared/lib/utils'

export function TurbineExchangeContent({ turbine }: { turbine: TurbineExchangeState }) {
  const { messages: t } = useI18n()
  const showOverviewSkeleton = turbine.overview.isLoading

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.turbine.dataTitle}</DappContentHeading>
        <div className={cn('grid grid-cols-3 gap-4', 'max-dapp:grid-cols-1 max-dapp:gap-2.5')}>
          {showOverviewSkeleton ? (
            <>
              <ExchangeMetricCardSkeleton />
              <ExchangeMetricCardSkeleton />
              <ExchangeMetricCardSkeleton />
            </>
          ) : (
            <>
              <ExchangeMetricCard
                hint={
                  turbine.overview.pendingUnlockUsdHint
                    ? `≈ ${turbine.overview.pendingUnlockUsdHint}`
                    : undefined
                }
                label={t.exchange.turbine.metrics.pendingUnlock}
                value={
                  <span className="inline-flex items-center gap-2">
                    <DappIcon
                      alt=""
                      className="size-[22px] rounded-md"
                      size="token"
                      src={dappAssets.tokenGagx}
                    />
                    <Text as="span" variant="copy" className="font-semibold">
                      {turbine.overview.pendingUnlockLabel} gAGX
                    </Text>
                  </span>
                }
              />
              <ExchangeMetricCard
                hint={
                  turbine.overview.coolingUsdHint
                    ? `≈ ${turbine.overview.coolingUsdHint}`
                    : undefined
                }
                label={t.exchange.turbine.metrics.cooling}
                value={
                  <span className="inline-flex items-center gap-2">
                    <DappIcon
                      alt=""
                      className="size-[22px] rounded-md"
                      size="token"
                      src={dappAssets.tokenGagx}
                    />
                    <Text as="span" variant="copy" className="font-semibold">
                      {turbine.overview.coolingLabel} gAGX
                    </Text>
                  </span>
                }
              />
              <ExchangeMetricCard
                hint={
                  turbine.overview.totalWithdrawnUsdHint
                    ? `≈ ${turbine.overview.totalWithdrawnUsdHint}`
                    : undefined
                }
                label={t.exchange.turbine.metrics.totalWithdrawn}
                value={
                  <span className="inline-flex items-center gap-2">
                    <DappIcon
                      alt=""
                      className="size-[22px] rounded-md"
                      size="token"
                      src={dappAssets.tokenGagx}
                    />
                    <Text as="span" variant="copy" className="font-semibold">
                      {/* No cumulative claim index on-chain yet — honest empty (leaf DEFER). */}
                      {turbine.overview.totalWithdrawnLabel}
                    </Text>
                  </span>
                }
              />
            </>
          )}
        </div>
      </section>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.aboutTitle}</DappContentHeading>
        {/* Figma 4435:220 about-carousel: gAGX · USD1 · X · gAGX质押 */}
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'gagxStake']} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.recordsTitle}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['210px', '120px', '160px', '1fr']}
            headers={t.exchange.turbine.recordColumns}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.exchange.turbine.recordsEmpty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.mechanismTitle}</DappContentHeading>
        <Text as="p" variant="support" tone="muted-foreground" className="mt-1">
          {t.exchange.turbine.mechanismIntro}
        </Text>
        <div className="mt-3 grid grid-cols-2 gap-4 max-dapp:grid-cols-1 max-dapp:gap-3">
          {t.exchange.turbine.mechanism.map((item) => (
            <div key={item.title} className="rounded-lg border border-border px-3.5 py-3">
              <Text as="p" variant="detail" className="font-semibold">
                {item.title}
              </Text>
              <Text as="p" variant="copy" tone="muted-foreground" className="mt-1">
                {item.body}
              </Text>
            </div>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList items={t.exchange.turbine.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
