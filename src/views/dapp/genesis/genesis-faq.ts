import { formatTokenAmount } from '~/core/exchange/token-amount'
import { type PresalePhaseOnChain, USD1_DECIMALS } from '~/core/presale/presale-math'
import { formatGroupedNumber } from '~/shared/api/format-display'

export interface GenesisFaqTemplateValues extends Record<string, string> {
  phaseCount: string
  phaseDurationDays: string
  discounts: string
  minUsd: string
  shareIncrement: string
  phaseQuotas: string
  threshold: string
  airdropRatios: string
}

function formatUsdRange(min: bigint, max: bigint): string {
  return `$${formatTokenAmount(min, USD1_DECIMALS, 0)}–$${formatTokenAmount(max, USD1_DECIMALS, 0)}`
}

function formatDiscountList(phases: PresalePhaseOnChain[]): string {
  return phases.map((phase) => `${(Number(phase.discountBps) / 100).toFixed(0)}%`).join(' / ')
}

function formatAirdropRatioList(phases: PresalePhaseOnChain[]): string {
  return phases
    .map((phase) => {
      const bps = Number(phase.airdropValueRatio > 0n ? phase.airdropValueRatio : 0n)
      return `${(bps / 100).toFixed(0)}%`
    })
    .join(' / ')
}

function formatPhaseDurationDays(phases: PresalePhaseOnChain[]): string {
  const dayCounts = phases.map((phase) =>
    Math.max(1, Math.round((Number(phase.endTime) - Number(phase.startTime)) / 86_400)),
  )

  if (dayCounts.length === 0) {
    return '0'
  }

  const [firstDayCount = 0] = dayCounts
  if (dayCounts.every((days) => days === firstDayCount)) {
    return String(firstDayCount)
  }

  return dayCounts.join(' / ')
}

function minUsd(phases: PresalePhaseOnChain[]): number {
  const minAmounts = phases
    .map((phase) => Number(phase.minAmount) / 10 ** USD1_DECIMALS)
    .filter((amount) => amount > 0)

  if (minAmounts.length === 0) {
    return 0
  }

  return Math.min(...minAmounts)
}

function shareIncrement(phases: PresalePhaseOnChain[]): string {
  const minWei = phases[0]?.minAmount
  if (minWei && minWei > 0n) {
    return formatTokenAmount(minWei, USD1_DECIMALS, 0)
  }

  return '0'
}

const ZERO_FAQ: GenesisFaqTemplateValues = {
  phaseCount: '0',
  phaseDurationDays: '0',
  discounts: '0%',
  minUsd: '$0',
  shareIncrement: '0',
  phaseQuotas: '$0–$0',
  threshold: '$0',
  airdropRatios: '0%',
}

/** FAQ 文案插值：未加载时全部回退为 0；调用方不得对 FAQ 数字做动画 */
export function genesisFaqTemplateValues(
  phases: PresalePhaseOnChain[],
  airdropThresholdUsd: number,
  isLoading = false,
): GenesisFaqTemplateValues {
  if (isLoading || phases.length === 0) {
    return ZERO_FAQ
  }

  const minUsdNumber = minUsd(phases)

  return {
    phaseCount: String(phases.length),
    phaseDurationDays: formatPhaseDurationDays(phases),
    discounts: formatDiscountList(phases),
    minUsd: formatGroupedNumber(minUsdNumber, { prefix: '$' }),
    shareIncrement: shareIncrement(phases),
    phaseQuotas: phases
      .map((phase) => formatUsdRange(phase.minAmount, phase.maxAmount))
      .join(' / '),
    threshold: formatGroupedNumber(Math.max(0, airdropThresholdUsd), { prefix: '$' }),
    airdropRatios: formatAirdropRatioList(phases),
  }
}
