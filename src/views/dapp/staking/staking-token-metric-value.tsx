import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappCountValue } from '~/shared/ui/dapp-count-value'

const PLACEHOLDER = '0.00'

export function StakingTokenMetricValue({ icon, value }: { icon: 'agx' | 'gagx'; value: string }) {
  const src = icon === 'agx' ? dappAssets.tokenAgx : dappAssets.tokenGagx
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <DappIcon alt="" className="size-[18px] shrink-0 rounded-full" src={src} />
      <DappCountValue text={value} />
    </span>
  )
}

/** Overview: first metric shows AGX icon; rest are plain zero placeholders. */
export function mapStakingOverviewPlaceholders(metrics: readonly { label: string }[]) {
  return metrics.map((metric, index) => {
    const value: ReactNode =
      index === 0 ? <StakingTokenMetricValue icon="agx" value={PLACEHOLDER} /> : PLACEHOLDER
    return { label: metric.label, value }
  })
}

/** Position cards: first three AGX, rest gAGX (Figma leaf). */
export function mapStakingPositionPlaceholders(metrics: readonly { label: string }[]) {
  return metrics.map((metric, index) => ({
    label: metric.label,
    value: <StakingTokenMetricValue icon={index < 3 ? 'agx' : 'gagx'} value={PLACEHOLDER} />,
  }))
}
