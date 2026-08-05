import { dappAssets } from '~/app/assets'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

/**
 * 代币指标值：图标 + 数值 + 可选近似美元
 *
 * @param icon 代币图标类型（agx / gagx / x）
 * @param value 主数值文本
 * @param approx 可选的近似美元标注，形如 `≈ $…`
 */
export function StakingTokenMetricValue({
  icon,
  value,
  approx,
}: {
  icon: 'agx' | 'gagx' | 'x'
  value: string
  /** 金额旁可选的近似美元值，形如 `≈ $…`。 */
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
