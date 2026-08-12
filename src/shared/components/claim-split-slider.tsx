import * as SliderPrimitive from '@radix-ui/react-slider'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type ClaimSplitSliderProps = {
  /** 无障碍名称；文案由调用方提供 */
  'aria-label': string
  className?: string
  disabled?: boolean
  onChange: (releasePct: number) => void
  /** 归入释放池的比例（0–100）；再质押比例 = 100 − 该值 */
  value: number
}

/** 仅界面层的 0–100 截断；真实比例仍由 core 的 `claimSplitFromReleasePct` 决定 */
function clampSliderPct(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

/**
 * 双色领取分配滑杆
 *
 * 珊瑚段 = 释放池；蓝色段 = 再质押；白色滑块内嵌百分比。
 * Root 用 `touch-none` + 加高热区，避免 H5 竖滚抢走拖动手势。
 * 标签 / 无障碍文案 / 分配计算由调用方负责（见 `claimSplitFromReleasePct`）。
 *
 * @param value 归入释放池的比例（0–100）
 * @param onChange 比例变化时回调（0–100）
 */
export function ClaimSplitSlider({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onChange,
  value,
}: ClaimSplitSliderProps) {
  const releasePct = clampSliderPct(value)

  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex h-8 w-full max-w-108 touch-none items-center select-none',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      data-claim-split-slider=""
      value={[releasePct]}
      max={100}
      step={1}
      disabled={disabled}
      onValueChange={(next) => onChange(next[0] ?? 0)}
      aria-label={ariaLabel}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 bg-primary"
          style={{ width: `${releasePct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 bg-(--app-claim-restake)"
          style={{ width: `${100 - releasePct}%` }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'flex h-6.5 min-w-13 cursor-grab items-center justify-center rounded-full',
          'border border-border bg-card px-3 py-1 shadow-sm',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'active:cursor-grabbing',
        )}
        asChild
      >
        <div>
          <Text as="span" variant="support" className="font-semibold text-foreground">
            {releasePct}%
          </Text>
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}
