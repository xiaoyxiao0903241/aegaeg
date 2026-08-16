import { type ElementType, useEffect, useState } from 'react'

import { cn } from '~/shared/lib/utils'

/** 数字滚动单格时长；比首页计数快（首页保持 1300ms） */
export const COUNT_DIGIT_MS = 420

/**
 * 指标闪动守卫：空串视为「未知 / 仍在加载」→ 保留上次文案。
 * 已结算零值须显式 `'0'` / `'0.00'` / `≈ $0.00`，禁用 `''`。
 *
 * @param next 新传入的指标文案
 * @param retained 上次展示的文案（可能为 null）
 * @returns 本次展示的文案与需要保留的文案
 */
export function metricDisplayText(
  next: string,
  retained: string | null,
): { display: string; retain: string | null } {
  if (next.trim() === '') {
    return { display: retained ?? '0', retain: retained }
  }
  return { display: next, retain: next }
}

type ParsedAmount = {
  prefix: string
  raw: string
  suffix: string
}

/**
 * 提取指标文案中的首个数字段（含分组或纯数字）
 *
 * @param text 指标文案
 * @returns 数字段的前缀 / 数字 / 后缀；无数字段时返回 null
 */
export function parseLeadingMetricNumber(text: string): ParsedAmount | null {
  const match = text.match(/^(.*?)([+-]?\d{1,3}(?:,\d{3})*(?:\.\d+)?|[+-]?\d+(?:\.\d+)?)(.*)$/s)
  if (!match) return null
  const [, prefix = '', raw = '', suffix = ''] = match
  return { prefix, raw, suffix }
}

/** 单个数字位：挂载从 0 滚到目标；之后随 digit 变化继续滚 */
function DigitReel({ digit }: { digit: number }) {
  const safe = Number.isFinite(digit) ? Math.min(9, Math.max(0, Math.trunc(digit))) : 0
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let cancelled = false
    let raf2 = 0
    // 双 rAF：先画出起点，再开 transition，避免首帧被合成到终态
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) setShown(safe)
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [safe])

  return (
    <span
      aria-hidden
      className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-baseline tabular-nums"
    >
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: `translateY(-${shown * 10}%)`,
          transitionProperty: 'transform',
          transitionDuration: `${COUNT_DIGIT_MS}ms`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  )
}

/**
 * 指标数字滚动
 *
 * 逐位同时滚动；挂载从 0 滚到目标（子视图 live 槽保证只挂一次），之后仅变化位翻转。
 * 静态文案（FAQ 等）传 `animate={false}`。
 *
 * @param text 要展示的指标文案（如 `'12,345.67'`）
 * @param animate 是否启用逐位滚动动画
 */
export function CountValue({
  text,
  animate = true,
  as: Comp = 'span',
  className,
}: {
  text: string
  animate?: boolean
  as?: ElementType
  className?: string
}) {
  const [retained, setRetained] = useState<string | null>(null)
  const { display, retain } = metricDisplayText(text, retained)
  if (retain !== retained) setRetained(retain)

  const parsed = parseLeadingMetricNumber(display)
  // 多段数字（倒计时 `08 小时 27 分钟…`）禁 DigitReel：只卷首位会裁成空白/残缺
  const multiNumeric = parsed != null && /\d/.test(parsed.suffix)

  if (!animate || parsed == null || multiNumeric) {
    return <Comp className={cn(className)}>{display}</Comp>
  }

  const { prefix, raw, suffix } = parsed
  const chars = raw.split('')

  return (
    <Comp className={cn('inline-flex items-baseline tabular-nums', className)}>
      {prefix ? <span>{prefix}</span> : null}
      <span className="inline-flex items-baseline" aria-label={raw}>
        {chars.map((ch, index) => {
          const fromRight = chars.length - 1 - index
          if (ch >= '0' && ch <= '9') {
            return <DigitReel digit={Number(ch)} key={`d-${fromRight}`} />
          }
          return (
            <span className="inline-block" key={`s-${fromRight}-${ch}`}>
              {ch}
            </span>
          )
        })}
      </span>
      {suffix ? <span>{suffix}</span> : null}
    </Comp>
  )
}
