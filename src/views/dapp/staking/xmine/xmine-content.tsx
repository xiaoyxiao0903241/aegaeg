import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useDappShell } from '~/app/use-dapp-shell'
import { useX0MiningPositions } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { mapX0MiningPositionToOpsRow } from '~/shared/api/map-flow-log-rows'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

const PLACEHOLDER = '0.00'

export function XmineContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const positionsQuery = useX0MiningPositions({}, sessionReady)
  const recordRows = positionsQuery.data?.items.map(mapX0MiningPositionToOpsRow) ?? []

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.xmine}
        faq={t.staking.xmine.faq}
        mechanismSteps={t.staking.xmine.mechanismSteps}
        mechanismTitle={t.staking.xmine.mechanismTitle}
        overviewItems={t.staking.xmine.overviewMetrics.map((metric) => ({
          label: metric.label,
          value: PLACEHOLDER,
        }))}
        overviewLayout="cards"
        positionItems={t.staking.xmine.positionMetrics.map((metric) => ({
          label: metric.label,
          value: PLACEHOLDER,
        }))}
        recordColWidths={['10.9375rem', '6.25rem', '8.75rem', '1fr']}
        recordColumns={t.staking.aside.xmineRecordColumns}
        recordRows={recordRows}
        recordsEmptyTitle={
          sessionReady && positionsQuery.isLoading ? '…' : t.staking.aside.recordsEmpty.xmine
        }
        recordsTitle={t.staking.aside.recordsTitles.xmine}
        showXValueCard
      />
    </DappDetailPage>
  )
}
