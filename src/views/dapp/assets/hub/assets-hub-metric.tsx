import type { ReactNode } from 'react'

import { DappIcon } from '~/app/shell/dapp-icon'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'

function renderMetric(node: ReactNode) {
  return typeof node === 'string' ? <DappCountValue text={node} /> : node
}

/** Icon + primary value + approx used in assets hub overview cards. */
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
      <Text as="span" tone="muted-foreground" variant="detail">
        {label}
      </Text>
      <div className="flex items-start gap-1">
        <DappIcon alt="" className="mt-0.5 rounded-control" size="lg" src={icon} />
        <div className="grid gap-1">
          <Text as="strong" className="text-base font-semibold" variant="copy">
            {renderMetric(value)}
          </Text>
          <Text as="span" tone="muted-foreground" variant="detail">
            {renderMetric(approx)}
          </Text>
        </div>
      </div>
    </div>
  )
}

/** Label + value + approx without icon. */
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
      <Text as="span" tone="muted-foreground" variant="detail">
        {label}
      </Text>
      <Text as="strong" className="text-base font-semibold" variant="copy">
        {renderMetric(value)}
      </Text>
      <Text as="span" tone="muted-foreground" variant="detail">
        {renderMetric(approx)}
      </Text>
    </div>
  )
}
