import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useDappShell } from '~/app/use-dapp-shell'
import { useStakeFlowPositions } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { mapStakePositionToAsideRow } from '~/shared/api/map-flow-log-rows'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'
import {
  mapStakingOverviewPlaceholders,
  mapStakingPositionPlaceholders,
} from '~/views/dapp/staking/staking-token-metric-value'

export function StakeContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const positionsQuery = useStakeFlowPositions({}, sessionReady)
  const recordRows = positionsQuery.data?.items.map(mapStakePositionToAsideRow) ?? []

  const overviewItems = mapStakingOverviewPlaceholders(t.staking.stake.overviewMetrics)
  const positionItems = mapStakingPositionPlaceholders(t.staking.aside.positionMetrics)

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.stake}
        faq={t.staking.stake.faq}
        mechanismSteps={t.staking.stake.mechanismSteps}
        mechanismTitle={t.staking.stake.mechanismTitle}
        overviewItems={overviewItems}
        overviewLayout="cards"
        positionItems={positionItems}
        recordRows={recordRows}
        recordsEmptyTitle={
          sessionReady && positionsQuery.isLoading ? '…' : t.staking.aside.recordsEmpty
        }
        recordsTitle={t.staking.aside.recordsTitles.stake}
      />
    </DappDetailPage>
  )
}
