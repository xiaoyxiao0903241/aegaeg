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
  /** 左侧复投短词，如「复投」 */
  restakeLabel: string
  /** 右侧领取短词，如「领取」 */
  releaseLabel: string
  /** 轨上居中提示，如「拖动调整比例」 */
  hint: string
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
 * Mixed 确认按钮背景：左复投蓝、右领取橙，分界跟滑块一致。
 *
 * @param releasePct 归入释放池的比例（0–100）
 */
export function claimSplitCtaBackgroundImage(releasePct: number): string {
  const { restakePct, releasePct: release } = claimSplitTrackPct(releasePct)
  if (release >= 100) {
    return 'linear-gradient(to right, var(--primary), var(--primary))'
  }
  if (restakePct >= 100) return 'linear-gradient(to right, var(--claim), var(--claim))'
  return `linear-gradient(to right, var(--claim) 0%, color-mix(in oklab, var(--claim) 45%, var(--primary) 55%) ${restakePct}%, var(--primary) 100%)`
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
 * 左蓝 = 复投；右橙 = 领取。百分比标签在轨上方（左 `%`+复投，右领取+`%`），
 * 中间提示拖动。白色滑块在分界上，内嵌两侧数字；阴影与原先一致。
 * Root 用 `touch-none` + 加高热区，避免 H5 竖滚抢走拖动手势。
 * 文案由调用方传入（见 `claimSplitFromReleasePct`）。
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
  restakeLabel,
  releaseLabel,
  hint,
}: ClaimSplitSliderProps) {
  const { releasePct, restakePct } = claimSplitTrackPct(value)

  return (
    <div className={cn('grid w-full max-w-108 gap-3', disabled && 'opacity-60', className)}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-2">
        <div className="flex min-w-0 items-baseline justify-start gap-1 whitespace-nowrap">
          <Text as="strong" className="font-semibold tabular-nums" tone="claim" variant="headline">
            {restakePct}%
          </Text>
          <Text as="span" variant="copy">
            {restakeLabel}
          </Text>
        </div>
        <Text
          as="span"
          className="px-1 text-center whitespace-nowrap"
          tone="muted-foreground"
          variant="copy"
        >
          {hint}
        </Text>
        <div className="flex min-w-0 items-baseline justify-end gap-1 whitespace-nowrap">
          <Text as="span" variant="copy">
            {releaseLabel}
          </Text>
          <Text
            as="strong"
            className="font-semibold tabular-nums"
            tone="primary"
            variant="headline"
          >
            {releasePct}%
          </Text>
        </div>
      </div>
      <SliderPrimitive.Root
        className={cn(
          'relative flex h-8 w-full touch-none items-center select-none',
          disabled && 'pointer-events-none',
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
            className="absolute inset-y-0 left-0 bg-claim"
            style={{ width: `${restakePct}%` }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 bg-primary"
            style={{ width: `${releasePct}%` }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            'flex h-6.5 cursor-grab items-center justify-center rounded-full',
            'border border-border bg-card px-3 py-1 shadow-sm',
            'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'active:cursor-grabbing',
          )}
          asChild
        >
          <div>
            <Text as="span" className="font-semibold tabular-nums" tone="claim" variant="support">
              {restakePct}
            </Text>
            <span aria-hidden className="mx-1.5 inline-block h-3 w-px bg-border" />
            <Text as="span" className="font-semibold tabular-nums" tone="primary" variant="support">
              {releasePct}
            </Text>
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  )
}
