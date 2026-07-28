import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { rewardsProgressRow } from '~/views/dapp/rewards/rewards-widget-styles'

export function RewardsProgressRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  const styles = rewardsProgressRow()
  return (
    <div className={styles.row()}>
      <Text variant="support" tone="muted-foreground">
        {label}
      </Text>
      <Text as="strong" variant="support" tone="foreground" className="text-right font-semibold">
        {value}
      </Text>
    </div>
  )
}
