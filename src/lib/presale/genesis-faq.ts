import { formatUsd } from '~/lib/api/format-display'
import { PRESALE_CONFIG } from '~/config/presale'
import {
  AIRDROP_BPS_BY_PHASE,
  type PresalePhaseOnChain,
} from '~/lib/presale/presale-math'
import { formatTokenAmount } from '~/lib/swap/token-amount'

const USD1_DECIMALS = 18

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

function formatUsdAmountFromWei(amount: bigint): string {
  return Number(formatTokenAmount(amount, USD1_DECIMALS, 0)).toLocaleString('en-US')
}

function formatUsdRange(min: bigint, max: bigint): string {
  return `$${formatUsdAmountFromWei(min)}–$${formatUsdAmountFromWei(max)}`
}

function formatDiscountList(phases: PresalePhaseOnChain[]): string {
  return phases
    .map((phase) => `${(Number(phase.discountBps) / 100).toFixed(0)}%`)
    .join(' / ')
}

function formatAirdropRatioList(phases: PresalePhaseOnChain[]): string {
  return phases
    .map((phase, index) => {
      const bps =
        phase.airdropValueRatio > 0n
          ? Number(phase.airdropValueRatio)
          : (AIRDROP_BPS_BY_PHASE[index] ?? 100)
      return `${(bps / 100).toFixed(0)}%`
    })
    .join(' / ')
}

function formatPhaseDurationDays(phases: PresalePhaseOnChain[]): string {
  const dayCounts = phases.map((phase) =>
    Math.max(1, Math.round((Number(phase.endTime) - Number(phase.startTime)) / 86_400)),
  )

  if (dayCounts.length === 0) {
    return String(Math.round(PRESALE_CONFIG.phaseDurationSeconds / 86_400))
  }

  const [firstDayCount = 0] = dayCounts
  if (dayCounts.every((days) => days === firstDayCount)) {
    return String(firstDayCount)
  }

  return dayCounts.join(' / ')
}

function resolveMinUsd(phases: PresalePhaseOnChain[]): number {
  const minAmounts = phases
    .map((phase) => Number(formatTokenAmount(phase.minAmount, USD1_DECIMALS, 0)))
    .filter((amount) => amount > 0)

  if (minAmounts.length === 0) {
    return Number(PRESALE_CONFIG.phases[0]?.minUsd1 ?? PRESALE_CONFIG.sharePriceUsd1)
  }

  return Math.min(...minAmounts)
}

function resolveShareIncrement(phases: PresalePhaseOnChain[]): string {
  const minWei = phases[0]?.minAmount
  if (minWei && minWei > 0n) {
    return formatUsdAmountFromWei(minWei)
  }

  return PRESALE_CONFIG.sharePriceUsd1
}

export function buildGenesisFaqTemplateValues(
  phases: PresalePhaseOnChain[],
  airdropThresholdUsd: number,
  isLoading = false,
): GenesisFaqTemplateValues {
  const ellipsis = '…'

  if (isLoading || phases.length === 0) {
    return {
      phaseCount: ellipsis,
      phaseDurationDays: ellipsis,
      discounts: ellipsis,
      minUsd: ellipsis,
      shareIncrement: ellipsis,
      phaseQuotas: ellipsis,
      threshold: ellipsis,
      airdropRatios: ellipsis,
    }
  }

  const minUsdNumber = resolveMinUsd(phases)

  return {
    phaseCount: String(phases.length),
    phaseDurationDays: formatPhaseDurationDays(phases),
    discounts: formatDiscountList(phases),
    minUsd: formatUsd(minUsdNumber),
    shareIncrement: resolveShareIncrement(phases),
    phaseQuotas: phases.map((phase) => formatUsdRange(phase.minAmount, phase.maxAmount)).join(' / '),
    threshold: formatUsd(airdropThresholdUsd),
    airdropRatios: formatAirdropRatioList(phases),
  }
}
