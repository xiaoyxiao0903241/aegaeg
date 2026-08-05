import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { dappAssets } from '~/shared/config/assets'

type MetricIcon = 'agx' | 'usd1' | null

/** Hub 指标值行：可选代币图标 + 主值 + 次要 USD 副标。 */
export function HubMetricValueRow({
  icon,
  sub,
  value,
}: {
  icon: MetricIcon
  sub?: string
  value: string
}) {
  const src = icon === 'agx' ? dappAssets.tokenAgx : icon === 'usd1' ? dappAssets.tokenUsd1 : null

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {src ? <Icon alt="" shape="circle" size="lg" src={src} /> : null}
      <span className="min-w-0 wrap-break-word">
        <CountValue text={value} />
      </span>
      {sub ? (
        <Text as="span" className="shrink-0 wrap-break-word text-foreground/40" variant="copy">
          <CountValue text={sub} />
        </Text>
      ) : null}
    </span>
  )
}
