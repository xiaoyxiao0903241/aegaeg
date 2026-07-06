import { useI18n } from '~/i18n/use-i18n'
import { MetricGrid } from '~/app/components/metric-grid'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import {
  GenesisMetricCard,
  GenesisMetricCardSkeleton,
  genesisMetricGrid,
} from '~/views/dapp/genesis/genesis-metric-card'

export function GenesisSeasonMetricsSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  return (
    <MetricGrid className={genesisMetricGrid()} columns={4}>
      {genesis.isLoading && genesis.phases.length === 0 ? (
        <>
          <GenesisMetricCardSkeleton />
          <GenesisMetricCardSkeleton />
          <GenesisMetricCardSkeleton />
          <GenesisMetricCardSkeleton />
        </>
      ) : (
        <>
          <GenesisMetricCard
            label={genesis.countdownMode === 'ends' ? t.genesis.endsIn : t.genesis.startsIn}
            tabular
            value={genesis.countdown}
          />
          <GenesisMetricCard
            label={<span className="text-muted-foreground">{t.genesis.referencePrice}</span>}
            tabular
            value={genesis.referencePriceLabel}
          />
          <GenesisMetricCard
            label={t.genesis.discountRatio}
            tabular
            value={genesis.discountLabel}
          />
          <GenesisMetricCard label={t.genesis.xAirdropRatio} value={genesis.airdropLabel} />
        </>
      )}
    </MetricGrid>
  )
}
