import { dappAssets } from '~/app/assets'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

export function StakingTokenMetricValue({
  icon,
  value,
  approx,
}: {
  icon: 'agx' | 'gagx' | 'x'
  value: string
  /** Figma inline `≈ $…` next to amount (optional). */
  approx?: string
}) {
  const src =
    icon === 'agx' ? dappAssets.tokenAgx : icon === 'x' ? dappAssets.tokenX : dappAssets.tokenGagx
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1.5">
      <Icon alt="" shape="circle" size="lg" src={src} />
      <CountValue text={value} />
      {approx ? (
        <Text as="span" className="font-normal text-foreground/40" variant="detail">
          {approx}
        </Text>
      ) : null}
    </span>
  )
}
