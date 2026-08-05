import { cn } from '~/shared/lib/utils'

/**
 * 进度条，按 0–100 数值显示填充比例。
 *
 * @param label 无障碍标签
 * @param value 进度值，越界时收拢到 0–100，非法值按 0
 */
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
  const fillWidth = clampedValue > 0 ? `max(${clampedValue.toFixed(2)}%, 0.25rem)` : '0%'

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
