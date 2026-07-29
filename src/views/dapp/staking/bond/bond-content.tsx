import type { ReactNode } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'

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

export function BondContent({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond
  const recordsTitle =
    kind === 'lp' ? t.staking.aside.recordsTitles.lpbond : t.staking.aside.recordsTitles.burnbond
  const chartTitle =
    kind === 'lp' ? t.staking.aside.chartTitles.lpbond : t.staking.aside.chartTitles.burnbond

  const overviewItems = copy.overviewMetrics.map((metric, index) => {
    const value: ReactNode =
      index === 0 ? <TokenMetricValue icon="agx" value={PLACEHOLDER} /> : PLACEHOLDER
    return { label: metric.label, value }
  })

  const positionItems = copy.positionMetrics.map((metric, index) => ({
    label: metric.label,
    value: <TokenMetricValue icon={index < 3 ? 'agx' : 'gagx'} value={PLACEHOLDER} />,
  }))

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
        recordColWidths={['140px', '70px', '90px', '70px', '110px', '1fr']}
        recordColumns={t.staking.aside.bondRecordColumns}
        recordsTitle={recordsTitle}
      />
    </DappDetailPage>
  )
}
