import { Chip } from '~/shared/components/chip'
import { cn } from '~/shared/lib/utils'

export type PercentButtonRowProps = {
  'aria-label': string
  className?: string
  disabled?: boolean
  onSelect: (percent: number) => void
  values?: number[]
  /** 快捷按钮的文案格式；Turbine 末档渲染「Max」，默认渲染 `N%`。 */
  formatLabel?: (percent: number) => string
}

/**
 * 卖出金额百分比快捷按钮行（25/50/75/100）
 *
 * 纯页面控件，非分段选择器；点击回调传入对应百分比。
 */
export function PercentButtonRow({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  formatLabel = (percent) => `${percent}%`,
  onSelect,
  values = [25, 50, 75, 100],
}: PercentButtonRowProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)} role="group" aria-label={ariaLabel}>
      {values.map((percent) => (
        <Chip
          key={percent}
          className="h-6 min-h-6 py-0 text-xs font-semibold"
          disabled={disabled}
          onClick={() => onSelect(percent)}
          shape="pill"
          size="md"
          type="button"
          variant="outlined"
          tone="default"
        >
          {formatLabel(percent)}
        </Chip>
      ))}
    </div>
  )
}
