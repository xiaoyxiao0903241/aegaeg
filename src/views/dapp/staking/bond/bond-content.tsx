import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useDappShell } from '~/app/use-dapp-shell'
import { useBondFlowBurnPurchases, useBondFlowLpPurchases } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { mapBondPurchaseToAsideRow } from '~/shared/api/map-flow-log-rows'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'
import {
  mapStakingOverviewPlaceholders,
  mapStakingPositionPlaceholders,
} from '~/views/dapp/staking/staking-token-metric-value'

export function BondContent({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond
  const recordsTitle =
    kind === 'lp' ? t.staking.aside.recordsTitles.lpbond : t.staking.aside.recordsTitles.burnbond
  const chartTitle =
    kind === 'lp' ? t.staking.aside.chartTitles.lpbond : t.staking.aside.chartTitles.burnbond
  const lpPurchases = useBondFlowLpPurchases({}, sessionReady && kind === 'lp')
  const burnPurchases = useBondFlowBurnPurchases({}, sessionReady && kind === 'burn')
  const purchasesQuery = kind === 'lp' ? lpPurchases : burnPurchases
  const recordRows = purchasesQuery.data?.items.map(mapBondPurchaseToAsideRow) ?? []

  const overviewItems = mapStakingOverviewPlaceholders(copy.overviewMetrics)
  const positionItems = mapStakingPositionPlaceholders(copy.positionMetrics)

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={chartTitle}
        faq={copy.faq}
        mechanismSteps={copy.mechanismSteps}
        mechanismTitle={copy.mechanismTitle}
        overviewItems={overviewItems}
        overviewLayout="cards"
        positionItems={positionItems}
        positionLayout="cards-2"
        recordColWidths={['8.75rem', '4.375rem', '5.625rem', '4.375rem', '6.875rem', '1fr']}
        recordColumns={t.staking.aside.bondRecordColumns}
        recordRows={recordRows}
        recordsEmptyTitle={
          sessionReady && purchasesQuery.isLoading
            ? '…'
            : kind === 'lp'
              ? t.staking.aside.recordsEmpty.lpbond
              : t.staking.aside.recordsEmpty.burnbond
        }
        recordsTitle={recordsTitle}
      />
    </DappDetailPage>
  )
}
