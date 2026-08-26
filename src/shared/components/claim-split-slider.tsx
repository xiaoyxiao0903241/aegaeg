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
 * 滑块左段复投、右段领取。与 CTA 渐变同一套比例。
 *
 * @param releasePct 归入释放池的比例（0–100）
 */
export function claimSplitTrackPct(releasePct: number): {
  releasePct: number
  restakePct: number
} {
  const release = clampSliderPct(releasePct)
  return { releasePct: release, restakePct: 100 - release }
}

/**
 * Mixed 确认按钮背景：左复投橙、右领取蓝，分界跟滑块一致。
 *
 * @param releasePct 归入释放池的比例（0–100）
 */
export function claimSplitCtaBackgroundImage(releasePct: number): string {
  const { restakePct, releasePct: release } = claimSplitTrackPct(releasePct)
  if (release >= 100) {
    return 'linear-gradient(to right, var(--claim-restake), var(--claim-restake))'
  }
  if (restakePct >= 100) return 'linear-gradient(to right, var(--primary), var(--primary))'
  return `linear-gradient(to right, var(--primary) 0%, color-mix(in oklab, var(--primary) 45%, var(--claim-restake) 55%) ${restakePct}%, var(--claim-restake) 100%)`
}

/**
 * Mixed 确认 CTA 的 inline 背景。
 *
 * 可点时画分流渐变；禁用 / 加载返回 `none`，让主按钮走 muted，不要压住禁用底。
 *
 * @param releasePct 归入释放池的比例（0–100）
 * @param active 按钮可点且未在提交
 */
export function claimSplitCtaStyle(
  releasePct: number,
  active: boolean,
): { backgroundImage: string } {
  return {
    backgroundImage: active ? claimSplitCtaBackgroundImage(releasePct) : 'none',
  }
}

/**
 * 双色领取分配滑杆
 *
 * 左橙 = 复投；右蓝 = 领取；白色滑块在分界上，内嵌左侧复投%。
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
  const { releasePct, restakePct } = claimSplitTrackPct(value)

  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex h-8 w-full max-w-108 touch-none items-center select-none',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      data-claim-split-slider=""
      value={[restakePct]}
      max={100}
      step={1}
      disabled={disabled}
      onValueChange={(next) => onChange(100 - clampSliderPct(next[0] ?? 0))}
      aria-label={ariaLabel}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 bg-primary"
          style={{ width: `${restakePct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 bg-(--app-claim-restake)"
          style={{ width: `${releasePct}%` }}
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
            {restakePct}%
          </Text>
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}
