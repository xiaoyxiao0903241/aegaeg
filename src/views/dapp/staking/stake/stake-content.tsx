import type { ReactNode } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useStakeFlowPositions } from '~/hooks/use-api-data'
import { mapStakePositionToAsideRow } from '~/shared/api/map-flow-log-rows'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

const PLACEHOLDER = '—'

function TokenMetricValue({ icon, value }: { icon: 'agx' | 'gagx'; value: string }) {
  const src = icon === 'agx' ? dappAssets.tokenAgx : dappAssets.tokenGagx
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <DappIcon alt="" className="size-[18px] shrink-0 rounded-full" src={src} />
      <span>{value}</span>
    </span>
  )
}

export function StakeContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const positionsQuery = useStakeFlowPositions({}, sessionReady)
  const recordRows = positionsQuery.data?.items.map(mapStakePositionToAsideRow) ?? []

  const overviewItems = t.staking.stake.overviewMetrics.map((metric, index) => {
    const value: ReactNode =
      index === 0 ? <TokenMetricValue icon="agx" value={PLACEHOLDER} /> : PLACEHOLDER
    return { label: metric.label, value }
  })

  const positionItems = t.staking.aside.positionMetrics.map((metric, index) => ({
    label: metric.label,
    value: <TokenMetricValue icon={index < 3 ? 'agx' : 'gagx'} value={PLACEHOLDER} />,
  }))

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
