import { cn } from '~/lib/utils'

export function ProgressMeter({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: number
}) {
  const clampedValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0
  const fillWidth =
    clampedValue > 0 ? `max(${clampedValue.toFixed(2)}%, 4px)` : '0%'

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(clampedValue)}
      className={cn('dapp-progress-meter', className)}
      role="progressbar"
    >
      <div className="dapp-progress-meter__fill" style={{ width: fillWidth }} />
    </div>
  )
}
