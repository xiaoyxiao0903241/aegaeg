import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'

export function StakingTokenMetricValue({
  icon,
  value,
  approx,
}: {
  icon: 'agx' | 'gagx'
  value: string
  /** Figma inline `≈ $…` next to amount (optional). */
  approx?: string
}) {
  const src = icon === 'agx' ? dappAssets.tokenAgx : dappAssets.tokenGagx
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1.5">
      <DappIcon alt="" className="shrink-0 rounded-full" size="lg" src={src} />
      <DappCountValue text={value} />
      {approx ? (
        <Text as="span" className="font-normal" tone="muted-foreground" variant="detail">
          {approx}
        </Text>
      ) : null}
    </span>
  )
}
