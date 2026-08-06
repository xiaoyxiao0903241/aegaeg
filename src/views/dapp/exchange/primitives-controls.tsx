import { Chip } from '~/shared/components/chip'
import { CollapseChevron } from '~/shared/components/collapse-chevron'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

// —— token-chip ——

/**
 * 代币徽标：图标 + 名称。
 *
 * 默认纯展示；`picker` 为 true 时渲染成可点击的选择按钮，
 * 并带下拉箭头，`open` 控制箭头朝向。
 */
export function TokenChip({
  icon,
  label,
  onClick,
  open = false,
  picker = false,
}: {
  icon?: string
  label: string
  /** 是否带下拉箭头的选择按钮形态。 */
  picker?: boolean
  /** 下拉是否展开；picker 时驱动 CollapseChevron */
  open?: boolean
  onClick?: () => void
}) {
  const body = (
    <>
      {icon ? <Icon alt="" className="rounded-md" loading="lazy" size="token" src={icon} /> : null}
      <Text as="span" variant="detail" className="leading-[1.2] font-semibold">
        {label}
      </Text>
      {picker ? <CollapseChevron open={open} size="sm" /> : null}
    </>
  )

  if (!picker) {
    return <span className="inline-flex items-center gap-2">{body}</span>
  }

  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-background px-2.5 py-1.5',
        onClick && 'cursor-pointer',
        !onClick && 'cursor-default',
      )}
      onClick={onClick}
      type="button"
    >
      {body}
    </button>
  )
}

// —— percent-button-row ——

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
