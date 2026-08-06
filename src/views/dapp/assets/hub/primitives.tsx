import type { ReactNode } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'

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
