import type { ReactNode } from 'react'
import { useState } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'
import type { HoldingsDistributionView } from '~/shared/presenters/build-holdings-distribution'

function renderMetric(node: ReactNode) {
  return typeof node === 'string' ? <CountValue text={node} /> : node
}

/** 带币种图标的指标项：标签 + 图标 + 主值 + 约值 */
export function AssetsHubMetricWithIcon({
  label,
  icon,
  value,
  approx,
}: {
  label: string
  icon: string
  value: ReactNode
  approx: ReactNode
}) {
  return (
    <div className="grid gap-0.5">
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {label}
      </Text>
      <div className="flex items-start gap-1">
        <Icon alt="" className="mt-0.5 rounded-control" size="lg" src={icon} />
        <div className="grid gap-0.5">
          <Text as="strong" className="text-base/4.5 font-semibold">
            {renderMetric(value)}
          </Text>
          <Text as="span" className="leading-4 text-foreground/40" variant="copy">
            {renderMetric(approx)}
          </Text>
        </div>
      </div>
    </div>
  )
}

/** 无图标的指标项：标签 + 主值 + 约值 */
export function AssetsHubMetricPlain({
  label,
  value,
  approx,
}: {
  label: string
  value: ReactNode
  approx: ReactNode
}) {
  return (
    <div className="grid gap-0.5">
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {label}
      </Text>
      <Text as="strong" className="text-base/4.5 font-semibold">
        {renderMetric(value)}
      </Text>
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {renderMetric(approx)}
      </Text>
    </div>
  )
}

/**
 * 资产持仓或缓冲数据卡
 *
 * 上方标题，下方两列数字；缓冲卡可在标题旁切换币种。
 */

export function AssetsMetricGroupCard({
  children,
  title,
  titleAction,
}: {
  children: ReactNode
  title: string
  titleAction?: ReactNode
}) {
  return (
    <Card surface="elevated" className="grid gap-1.5">
      {titleAction != null ? (
        <div className="flex items-center justify-between gap-2">
          <Text as="span" className="leading-4 font-medium" variant="copy">
            {title}
          </Text>
          {titleAction}
        </div>
      ) : (
        <Text as="span" className="leading-4 font-medium" variant="copy">
          {title}
        </Text>
      )}
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </Card>
  )
}

/**
 * 资产总览深色卡片
 *
 * 右侧装饰图仅桌面显示；四个统计数字由页面传入排列。
 */

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

/**
 * 资产 Rebase 步骤说明卡
 *
 * 手机竖排步骤、桌面横排连线；底部要点标签与补充说明。
 */

type RebaseStep = {
  title: string
  body: string
}

export function AssetsRebaseCard({
  footer,
  steps,
  tags,
}: {
  footer: string
  steps: ReadonlyArray<RebaseStep>
  tags: ReadonlyArray<string>
}) {
  return (
    <Card surface="elevated" className="grid gap-1.5 py-6">
      {/* 移动端时间轴：左端点 + 竖线连接 */}
      <ol className="m-0 flex list-none flex-col p-0 dapp:hidden">
        {steps.map((step, index) => (
          <li className="flex gap-3" key={`h5-${step.title}-${step.body}-${index}`}>
            <div className="flex w-3 shrink-0 flex-col items-center self-stretch">
              <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
              {index < steps.length - 1 ? (
                <span aria-hidden className="mt-0.5 w-0.5 flex-1 bg-border" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pb-4">
              <Text as="p" className="leading-5 font-bold" variant="headline">
                {step.title}
              </Text>
              <Text as="p" className="mt-1 leading-4" tone="muted-foreground" variant="copy">
                {step.body.replaceAll('\n', '')}
              </Text>
            </div>
          </li>
        ))}
      </ol>

      {/* 桌面端横轴连线：线高须显式声明，否则不渲染 */}
      <div className="relative hidden grid-cols-4 items-center dapp:grid">
        <div
          aria-hidden
          className="absolute inset-x-[12.5%] top-1/2 h-0.5 -translate-y-1/2 bg-border"
        />
        {steps.map((step) => (
          <span className="relative z-1 flex justify-center" key={`dot-${step.title}-${step.body}`}>
            <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
          </span>
        ))}
      </div>

      <ol className="m-0 hidden list-none grid-cols-4 gap-2 p-0 dapp:grid">
        {steps.map((step) => (
          <li className="px-1 pt-4 text-center" key={step.title + step.body}>
            <Text as="p" className="leading-5 font-bold" variant="headline">
              {step.title}
            </Text>
            <Text
              as="p"
              className="mt-1.5 leading-4 whitespace-pre-line"
              tone="muted-foreground"
              variant="copy"
            >
              {step.body}
            </Text>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-start gap-2.5 dapp:flex-row dapp:flex-wrap dapp:items-center dapp:justify-between dapp:gap-x-4 dapp:gap-y-2 dapp:rounded-2xl dapp:bg-muted dapp:px-6 dapp:py-3.5">
        {tags.map((tag) => (
          <span className="flex items-center gap-2 dapp:gap-1.5" key={tag}>
            <Icon
              alt=""
              className="h-4 w-4.5 shrink-0"
              size="sm"
              src={dappAssets.assetsHubCheckBadge}
            />
            <Text as="span" className="leading-4 dapp:font-semibold" variant="copy">
              {tag}
            </Text>
          </span>
        ))}
      </div>

      <Text as="p" className="leading-4 text-foreground/40" variant="copy">
        {footer}
      </Text>
    </Card>
  )
}

/**
 * 持仓分布：左环右列（对齐原型）。
 * Hover 扇区外扩 + popover；右侧图例行同步高亮。
 */
export function AssetsHoldingsDistributionCard({
  totalLabel,
  totalCaption,
  view,
}: {
  totalCaption: string
  totalLabel: string
  view: HoldingsDistributionView
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const tipSeg = hoverIdx != null ? view.segs[hoverIdx] : null

  const paintOrder = view.segs
    .map((_, di) => di)
    .sort((a, b) => {
      if (a === hoverIdx) return 1
      if (b === hoverIdx) return -1
      return a - b
    })

  return (
    <div
      className="flex items-center gap-11 rounded-2xl border border-border bg-card px-7.5 py-6.5 max-dapp:flex-col max-dapp:gap-6 max-dapp:px-4 max-dapp:py-5"
      onMouseLeave={() => setHoverIdx(null)}
    >
      <div className="relative size-[264px] shrink-0 max-dapp:size-50">
        <svg aria-hidden className="size-full overflow-visible" viewBox="0 0 160 160">
          {paintOrder.map((di) => {
            const seg = view.segs[di]
            if (seg == null) return null
            const active = hoverIdx === di
            const dimmed = hoverIdx != null && !active
            const ux = (seg.labelX - 80) / PIE_R
            const uy = (seg.labelY - 80) / PIE_R
            const pop = active ? PIE_HOVER_POP : 0
            const scale = active ? PIE_HOVER_SCALE : 1
            return (
              <g
                key={seg.key}
                style={{
                  transformOrigin: '80px 80px',
                  transform: `translate(${ux * pop}px, ${uy * pop}px) scale(${scale})`,
                  transition: 'transform var(--duration-dapp-base) var(--ease-dapp)',
                }}
              >
                <circle
                  className="cursor-pointer"
                  cx="80"
                  cy="80"
                  fill="none"
                  onMouseEnter={() => setHoverIdx(di)}
                  r={PIE_R}
                  stroke={seg.color}
                  strokeDasharray={seg.dash}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="butt"
                  style={{
                    opacity: dimmed ? 0.55 : 1,
                    strokeWidth: active ? PIE_HOVER_SW : PIE_SW,
                    transition:
                      'stroke-width var(--duration-dapp-base) var(--ease-dapp), opacity var(--duration-dapp-fast) var(--ease-dapp)',
                  }}
                  transform="rotate(-90 80 80)"
                />
              </g>
            )
          })}
          {view.segs.map((seg) =>
            seg.showLabel ? (
              <text
                key={`${seg.key}-label`}
                style={{ pointerEvents: 'none' }}
                textAnchor="middle"
                x={seg.labelX}
                y={seg.labelY}
              >
                <tspan
                  dy="-2"
                  fill={seg.textColor}
                  style={{ fontSize: '8.5px', fontWeight: 700 }}
                  x={seg.labelX}
                >
                  {seg.label}
                </tspan>
                <tspan
                  dy="9.5"
                  fill={seg.textColor}
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  x={seg.labelX}
                >
                  {seg.pctLabel}
                </tspan>
              </text>
            ) : null,
          )}
        </svg>
        <span className="pointer-events-none absolute inset-0 grid place-content-center gap-0.5 text-center">
          <Text
            as="span"
            className="text-[11px] leading-none tracking-tight"
            tone="muted-foreground"
          >
            {totalCaption}
          </Text>
          <Text as="strong" className="text-base leading-none font-semibold tracking-tight">
            <CountValue text={totalLabel} />
          </Text>
        </span>
        {tipSeg ? (
          <div
            className="dapp-panel-enter pointer-events-none absolute z-2 grid gap-px rounded-md border border-border bg-card px-3 py-2 whitespace-nowrap shadow-[0_4px_16px_rgba(28,34,52,0.22)]"
            style={{
              left: `${((tipSeg.labelX / 160) * 100).toFixed(1)}%`,
              top: `${((tipSeg.labelY / 160) * 100).toFixed(1)}%`,
              transform: 'translate(-20%, -110%)',
            }}
          >
            <Text as="strong" className="text-[13px] leading-none font-bold tracking-tight">
              {tipSeg.label}
              <span className="font-normal">：{tipSeg.pctLabel}</span>
            </Text>
            <Text as="span" className="text-xs text-foreground/60 tabular-nums" variant="copy">
              {tipSeg.amountLabel}
            </Text>
            <Text as="span" className="text-xs text-foreground/45 tabular-nums" variant="copy">
              {tipSeg.usdLabel}
            </Text>
          </div>
        ) : null}
      </div>

      <ul className="m-0 flex min-w-0 flex-1 list-none flex-col justify-center self-stretch p-0">
        {view.segs.map((seg, di) => {
          const active = hoverIdx === di
          const dimmed = hoverIdx != null && !active
          return (
            <li
              className={cn(
                'duration-dapp-fast flex cursor-pointer items-center justify-between gap-3 py-3.5 transition-opacity ease-dapp',
                di < view.segs.length - 1 && 'border-b border-border',
                dimmed && 'opacity-55',
              )}
              key={seg.key}
              onMouseEnter={() => setHoverIdx(di)}
            >
              <span className="grid min-w-0 gap-1">
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <i
                    aria-hidden
                    className="duration-dapp-base inline-block size-2 shrink-0 rounded-full transition-transform ease-dapp"
                    style={{
                      background: seg.color,
                      transform: active ? 'scale(1.35)' : undefined,
                    }}
                  />
                  <Text as="span" className="leading-none text-foreground/70" variant="copy">
                    {seg.label}
                  </Text>
                </span>
                <Text
                  as="strong"
                  className="pl-4 text-sm leading-none font-semibold tabular-nums"
                  variant="detail"
                >
                  {seg.pctLabel}
                </Text>
              </span>
              <span className="grid shrink-0 justify-items-end gap-1">
                <Text
                  as="span"
                  className="text-[13px] leading-none font-medium whitespace-nowrap tabular-nums"
                >
                  <CountValue text={seg.amountLabel} />
                </Text>
                <Text
                  as="span"
                  className="text-xs leading-none whitespace-nowrap text-foreground/40 tabular-nums"
                  variant="copy"
                >
                  {seg.usdLabel}
                </Text>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const PIE_R = 54
const PIE_SW = 42
/** Hover：径向略放大 + 加粗描边 + 沿中线外推 */
const PIE_HOVER_SW = 50
const PIE_HOVER_SCALE = 1.06
const PIE_HOVER_POP = 3.5
