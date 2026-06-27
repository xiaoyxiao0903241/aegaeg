import { useI18n } from '~/i18n/use-i18n'
import { MetricCard } from '~/app/components/dapp-card'
import { MetricCardSkeleton } from '~/app/components/dapp-skeleton'
import { MetricGrid } from '~/app/components/metric-grid'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'

export function GenesisSeasonMetricsSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  return (
    <MetricGrid columns={4}>
      {genesis.isLoading && genesis.phases.length === 0 ? (
        <>
          <MetricCardSkeleton className="max-dapp:rounded-md" />
          <MetricCardSkeleton className="max-dapp:rounded-md" />
          <MetricCardSkeleton className="max-dapp:rounded-md" />
          <MetricCardSkeleton className="max-dapp:rounded-md" />
        </>
      ) : (
        <>
          <MetricCard
            className="[&_strong]:tabular-nums"
            label={genesis.countdownMode === 'ends' ? t.genesis.endsIn : t.genesis.startsIn}
            value={genesis.countdown}
          />
          <MetricCard
            className="[&_strong]:tabular-nums"
            label={<span className="text-muted-foreground">{t.genesis.referencePrice}</span>}
            value={genesis.referencePriceLabel}
          />
          <MetricCard
            className="[&_strong]:tabular-nums"
            label={t.genesis.discountRatio}
            value={genesis.discountLabel}
          />
          <MetricCard label={t.genesis.xAirdropRatio} value={genesis.airdropLabel} />
        </>
      )}
    </MetricGrid>
  )
}
