import { useI18n } from '~/i18n/use-i18n'
import { MetricGrid } from '~/app/shell/metric-grid'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import {
  GenesisMetricCard,
  GenesisMetricCardSkeleton,
  genesisMetricGrid,
} from '~/views/dapp/genesis/genesis-metric-card'

export function GenesisSeasonMetricsSection({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()

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
            value={genesis.countdown}
          />
          <GenesisMetricCard label={t.genesis.referencePrice} value={genesis.referencePriceLabel} />
          <GenesisMetricCard label={t.genesis.discountRatio} value={genesis.discountLabel} />
          <GenesisMetricCard label={t.genesis.xAirdropRatio} value={genesis.airdropLabel} />
        </>
      )}
    </MetricGrid>
  )
}
