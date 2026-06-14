import type { CSSProperties } from 'react'
import { dappLayout } from '../../components/primitive-styles'

export function ProgressMeter({
  label,
  value,
}: {
  label: string
  value: number
}) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <i
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clampedValue}
      className={dappLayout.progressTrack}
      role="progressbar"
    >
      <b
        className={dappLayout.progressValue}
        style={{ '--progress': clampedValue / 100 } as CSSProperties}
      />
    </i>
  )
}
