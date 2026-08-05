/**
 * 资产总览深色卡片
 *
 * 右侧装饰图仅桌面显示；四个统计数字由页面传入排列。
 */
import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'

export function AssetsOverviewCard({
  children,
  decoSrc,
}: {
  children: ReactNode
  decoSrc: string
}) {
  return (
    <Card
      surface="inverse"
      className="relative flex items-center overflow-hidden p-4 max-dapp:items-start max-dapp:pt-7.5 max-dapp:pb-4"
    >
      {/* 移动端装饰图在屏外，故隐藏 */}
      <img
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-76 object-cover object-right dapp:block"
        src={decoSrc}
      />
      <div className="relative z-1 grid w-full grid-cols-2 gap-4 dapp:grid-cols-4 dapp:gap-6">
        {children}
      </div>
    </Card>
  )
}

export function AssetsOverviewMetric({
  featured,
  hint,
  label,
  note,
  value,
}: {
  /** 首列跨两列，主值更大，可带说明气泡。 */
  featured?: boolean
  hint?: string
  label: string
  note?: string
  value: string
}) {
  return (
    <div className={cn('grid gap-0.5', featured && 'col-span-2 gap-1 dapp:col-span-1')}>
      <div className={cn(featured && 'flex items-center gap-1')}>
        <Text as="span" className="leading-4" tone="inverse" variant="copy">
          {label}
        </Text>
        {featured && hint ? (
          <Tooltip.Info className="size-3 [&_svg]:size-3 [&_svg]:text-white" content={hint} />
        ) : null}
      </div>
      <Text
        as="strong"
        className={cn('font-semibold', featured ? 'leading-none' : 'text-base/5')}
        tone="inverse"
        variant={featured ? 'stat' : undefined}
      >
        {value}
      </Text>
      {note ? (
        <Text as="span" className="leading-4 text-white/70" variant="copy">
          {note}
        </Text>
      ) : null}
    </div>
  )
}
