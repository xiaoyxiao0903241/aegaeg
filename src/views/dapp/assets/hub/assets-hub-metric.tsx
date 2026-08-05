import type { ReactNode } from 'react'

import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

function renderMetric(node: ReactNode) {
  return typeof node === 'string' ? <CountValue text={node} /> : node
}

/** 带币种图标的指标项：标签 + 图标 + 主值 + 约值 */
export function AssetsHubMetricWithIcon({
  label,
  icon,
  value,
  approx,
}: {
  label: string
  icon: string
  value: ReactNode
  approx: ReactNode
}) {
  return (
    <div className="grid gap-0.5">
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {label}
      </Text>
      <div className="flex items-start gap-1">
        <Icon alt="" className="mt-0.5 rounded-control" size="lg" src={icon} />
        <div className="grid gap-0.5">
          <Text as="strong" className="text-base leading-4.5 font-semibold">
            {renderMetric(value)}
          </Text>
          <Text as="span" className="leading-4 text-foreground/40" variant="copy">
            {renderMetric(approx)}
          </Text>
        </div>
      </div>
    </div>
  )
}

/** 无图标的指标项：标签 + 主值 + 约值 */
export function AssetsHubMetricPlain({
  label,
  value,
  approx,
}: {
  label: string
  value: ReactNode
  approx: ReactNode
}) {
  return (
    <div className="grid gap-0.5">
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {label}
      </Text>
      <Text as="strong" className="text-base leading-4.5 font-semibold">
        {renderMetric(value)}
      </Text>
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {renderMetric(approx)}
      </Text>
    </div>
  )
}
