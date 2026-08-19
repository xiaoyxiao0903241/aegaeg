/**
 * 质押域跨 mode UI 零件（倒计时 / 曲线 / 机制卡 / 指标值 / TVL 图）。
 */
import type { Time, UTCTimestamp } from 'lightweight-charts'
import { type ReactNode } from 'react'

import {
  buildCalcYieldCurvePoints,
  CALC_MAX_DAYS,
  calcLocalInterest,
  handbookBondDiscountRateBP,
} from '~/core/staking/staking-yield'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { Chart, type ChartPoint } from '~/shared/components/chart'
import { CountValue } from '~/shared/components/count-value'
import {
  CountdownValue,
  remainingSecFromBlocks,
  useAnchoredRemainingSec,
} from '~/shared/components/countdown-value'
import { Icon } from '~/shared/components/icon'
import { Segment } from '~/shared/components/segment'
import { Skeleton } from '~/shared/components/skeleton'
import { Steps } from '~/shared/components/steps'
import { Text } from '~/shared/components/text'
import { formatNumber } from '~/shared/presenters/format'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'

/**
 * 下一次 Rebase 发放倒计时
 *
 * 以链上块差锚定墙钟后每秒滴答更新。
 *
 * @param epochEndBlock 周期结束区块高度
 * @param currentBlock 当前区块高度
 * @param secondsPerBlock 实测或兜底出块秒数
 */
export function RebaseCountdownValue({
  epochEndBlock,
  currentBlock,
  secondsPerBlock,
}: {
  epochEndBlock: bigint | undefined
  currentBlock: bigint | undefined
  secondsPerBlock?: number
}) {
  const { messages: t } = useI18n()
  const units = t.staking.aside.countdownUnits
  const remainingSec = useAnchoredRemainingSec(
    remainingSecFromBlocks(epochEndBlock, currentBlock, secondsPerBlock),
  )

  return (
    <CountdownValue
      className="gap-x-1"
      labels={{
        hours: (
          <Text as="span" variant="detail">
            {units.hours}
          </Text>
        ),
        minutes: (
          <Text as="span" variant="detail">
            {units.minutes}
          </Text>
        ),
        seconds: (
          <Text as="span" variant="detail">
            {units.seconds}
          </Text>
        ),
      }}
      totalSec={remainingSec}
      trim={false}
      units={['hours', 'minutes', 'seconds']}
    />
  )
}

const CURVE_PLACEHOLDER = '0.00'

function formatUsdOrDash(value: number) {
  if (!Number.isFinite(value)) return CURVE_PLACEHOLDER
  return formatNumber(value, { digits: 2, prefix: '$' })
}

function pickDayAxisLabels(maxDays: number, dayTemplate: string, count = 5): readonly string[] {
  if (maxDays <= 0) return []
  if (count <= 1) return [interpolate(dayTemplate, { day: 1 })]
  const labels: string[] = []
  for (let i = 0; i < count; i += 1) {
    const day = Math.round(1 + (i / (count - 1)) * (maxDays - 1))
    labels.push(interpolate(dayTemplate, { day }))
  }
  return labels
}

/**
 * 测算累计收益曲线
 *
 * 曲线由本地公式按 day 1..720 生成；
 * 无测算结果时展示占位文案。
 */
export function StakingCurveChart() {
  const { messages: t } = useI18n()
  const aside = t.staking.calc.aside
  const result = useCalcEstimateStore((state) => state.result)

  const curveEndEstimate = result
    ? (() => {
        const isBondUsd1 = result.product === 'lpbond' || result.product === 'burnbond'
        const est = calcLocalInterest({
          product: result.product,
          period: result.period,
          principal: result.principal,
          days: CALC_MAX_DAYS,
          epochRebasePct: result.epochRebasePct,
          xmineDailyPct: result.xmineDailyPct,
          agxPriceUsd: isBondUsd1 ? result.price : null,
          discountRateBP: isBondUsd1 ? handbookBondDiscountRateBP(result.period) : null,
          epochsPerDay: result.epochsPerDay,
        })
        // 债券利息已是 USD；质押/xmine 利息为代币量 × 现价。与 buildCalcYieldCurvePoints 同口径。
        return isBondUsd1 ? est.interest : est.interest * result.price
      })()
    : null

  const curvePoints: readonly ChartPoint[] = result
    ? buildCalcYieldCurvePoints({
        product: result.product,
        period: result.period,
        principal: result.principal,
        price: result.price,
        epochRebasePct: result.epochRebasePct,
        xmineDailyPct: result.xmineDailyPct,
        epochsPerDay: result.epochsPerDay,
        discountRateBP:
          result.product === 'lpbond' || result.product === 'burnbond'
            ? handbookBondDiscountRateBP(result.period)
            : null,
        maxDays: CALC_MAX_DAYS,
      }).map((p) => ({
        time: p.day as UTCTimestamp,
        value: p.interestUsd,
      }))
    : []

  const axisLabels = pickDayAxisLabels(CALC_MAX_DAYS, aside.tags.day, 5)

  return (
    <Chart surface="elevated">
      <Chart.Header className="flex-col items-start justify-start gap-3">
        <Text as="p" className="m-0 text-foreground/40" variant="copy">
          {aside.curveHint}
        </Text>
        {curveEndEstimate != null ? (
          <Text as="strong" className="font-semibold" variant="section">
            {formatUsdOrDash(curveEndEstimate)}
          </Text>
        ) : null}
      </Chart.Header>
      {curvePoints.length > 0 ? (
        <Chart.Plot
          axisLabels={axisLabels}
          formatTipDate={(time: Time) => {
            if (typeof time !== 'number') return null
            return interpolate(aside.tags.day, { day: time })
          }}
          points={curvePoints}
        />
      ) : (
        <div className="flex items-center justify-center rounded-lg py-6">
          <Text as="span" className="text-foreground/40" variant="copy">
            {CURVE_PLACEHOLDER}
          </Text>
        </div>
      )}
    </Chart>
  )
}

/**
 * 质押 / 债券机制步骤卡
 *
 * 有步骤时展示步骤条；否则展示说明文案。
 */
export function StakingMechanismCard({
  mechanism,
  steps,
}: {
  mechanism?: string
  steps?: ReadonlyArray<{ title: string; body: string }>
}) {
  if (steps && steps.length > 0) {
    return (
      <Card className="rounded-2xl p-6" surface="elevated">
        <Steps align="start">
          {steps.map((step) => (
            <Steps.Item body={step.body} key={step.title} title={step.title} />
          ))}
        </Steps>
      </Card>
    )
  }

  if (mechanism == null || mechanism === '') return null

  return (
    <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
      {mechanism}
    </Text>
  )
}

/**
 * 质押详情指标主值
 *
 * 字符串走数字跳动，节点主值原样放入；外层仍用 `Tile` + `Tile.Label`。
 */
export function StakingMetricValue({ value }: { value: ReactNode }) {
  return (
    <Text
      as="strong"
      className="block min-w-0 text-base/5 font-semibold tracking-normal"
      variant="headline"
    >
      {typeof value === 'string' ? <CountValue text={value} /> : value}
    </Text>
  )
}

/**
 * 代币指标值：图标 + 数值 + 可选近似美元
 *
 * @param icon 代币图标类型（agx / gagx / x）
 * @param value 主数值文本
 * @param approx 可选的近似美元标注，形如 `≈ $…`
 */
export function StakingTokenMetricValue({
  icon,
  value,
  approx,
}: {
  icon: 'agx' | 'gagx' | 'x'
  value: string
  /** 金额旁可选的近似美元值，形如 `≈ $…`。 */
  approx?: string
}) {
  const src =
    icon === 'agx' ? dappAssets.tokenAgx : icon === 'x' ? dappAssets.tokenX : dappAssets.tokenGagx
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1.5">
      <Icon alt="" shape="circle" size="lg" src={src} />
      <CountValue text={value} />
      {approx ? (
        <Text as="span" className="font-normal text-foreground/40" variant="detail">
          {approx}
        </Text>
      ) : null}
    </span>
  )
}

/**
 * 质押 TVL / 市值历史图
 *
 * 范围切换与空态文案在本组件内；
 * `loading` 时展示曲线骨架；序列由调用方传入。
 */
export function StakingTvlChart({
  chartRange,
  deltaLabel,
  emptyLabel,
  loading = false,
  points,
  rangeAriaLabel,
  rangeLabels,
  setChartRange,
  surface = 'elevated',
  valueLabel,
}: {
  chartRange: string
  deltaLabel: string
  emptyLabel: string
  loading?: boolean
  points?: readonly ChartPoint[]
  rangeAriaLabel: string
  rangeLabels: readonly string[]
  setChartRange: (value: string) => void
  surface?: 'elevated' | 'outlined'
  valueLabel: string
}) {
  const hasSeries = points != null && points.length > 0

  return (
    <Chart surface={surface}>
      <Chart.Header>
        <div className="flex items-center gap-2">
          {loading ? (
            <>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-12" />
            </>
          ) : (
            <>
              <Text as="strong" className="text-xl/none font-semibold" variant="copy">
                {valueLabel}
              </Text>
              <Text as="span" className="text-success" variant="copy">
                {deltaLabel}
              </Text>
            </>
          )}
        </div>
        <Segment
          aria-label={rangeAriaLabel}
          onChange={setChartRange}
          options={rangeLabels.map((label) => ({ label, value: label }))}
          size="sm"
          tone="ink"
          value={chartRange}
        />
      </Chart.Header>
      {loading ? (
        <Chart.Skeleton />
      ) : hasSeries ? (
        <Chart.Plot points={points} />
      ) : (
        <Chart.Empty title={emptyLabel} />
      )}
    </Chart>
  )
}
