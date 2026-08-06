import type { ReactNode } from 'react'

import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  canPurchaseGenesis,
  clampGenesisShares,
  estimateAgxFromUsd1,
  estimateContributionValueUsd,
  getAirdropBpsForPhase,
  type PhaseCountdownMode,
  phaseDiscountBps,
  type PresalePhaseOnChain,
  USD1_DECIMALS,
} from '~/core/presale/presale-math'
import type { SalesLogItem } from '~/shared/api/types'
import { ExplorerLink } from '~/shared/components/explorer-link'
import {
  formatBlockTime,
  formatDiscountBps,
  formatNumber,
  TABLE_EMPTY,
} from '~/shared/presenters/format'
import type { useGenesisChainReads } from '~/views/dapp/genesis/use-genesis-chain-reads'

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
    minUsd: formatNumber(minUsdNumber, { prefix: '$' }),
    shareIncrement: shareIncrement(phases),
    phaseQuotas: phases
      .map((phase) => formatUsdRange(phase.minAmount, phase.maxAmount))
      .join(' / '),
    threshold: formatNumber(Math.max(0, airdropThresholdUsd), { prefix: '$' }),
    airdropRatios: formatAirdropRatioList(phases),
  }
}

type GenesisReads = ReturnType<typeof useGenesisChainReads>

/** 纯展示组装：由链上读取、份额草稿与倒计时汇总购买区块数据 */
export function genesisPurchaseSummary(args: {
  reads: GenesisReads
  sharesDraft: number
  countdown: string
  countdownMode: PhaseCountdownMode | null
  /** previewAirdropValue 的 addedAirdropValue；缺省或金额为 0 时展示 $0 */
  previewAddedAirdropValueWei?: bigint | null
}) {
  const { reads, sharesDraft, countdown, countdownMode, previewAddedAirdropValueWei } = args
  const shares = clampGenesisShares(sharesDraft, reads.maxShares)
  const purchaseAmount = reads.sharePriceWei > 0n ? reads.sharePriceWei * BigInt(shares) : 0n
  const payUsd1 = formatTokenAmountToNumber(purchaseAmount, USD1_DECIMALS)
  const estimatedAgx = estimateAgxFromUsd1(payUsd1, reads.discountBps, reads.agxPriceUsd)
  const contributionValueUsd = estimateContributionValueUsd(
    payUsd1,
    reads.discountBps,
    reads.agxPriceUsd,
  )
  const xTokenAirdropUsd =
    purchaseAmount > 0n && previewAddedAirdropValueWei != null
      ? formatTokenAmountToNumber(previewAddedAirdropValueWei, USD1_DECIMALS)
      : 0
  const quotaLabel = `$${formatTokenAmount(reads.minAmount, USD1_DECIMALS, 0)} – $${formatTokenAmount(reads.maxAmount, USD1_DECIMALS, 0)}`
  const isApproved = reads.walletReady && purchaseAmount > 0n && reads.allowance >= purchaseAmount
  const needsApproval = reads.walletReady && purchaseAmount > 0n && !isApproved
  const hasSufficientBalance = reads.usd1Balance >= purchaseAmount
  const canPurchase = canPurchaseGenesis({
    walletReady: reads.walletReady,
    hasActivePhase: reads.activePhase !== null,
    isBound: reads.isBound,
    isPaused: reads.isPaused || reads.isPausedUnknown,
    maxShares: reads.maxShares,
    shares,
    purchaseAmount,
    minAmount: reads.minAmount,
    maxPurchasableWei: reads.maxPurchasableWei,
  })

  return {
    shares,
    purchaseAmount,
    isApproved,
    needsApproval,
    hasSufficientBalance,
    canPurchase,
    display: {
      discountLabel: reads.discountLabel,
      discountBps: reads.discountBps,
      countdown,
      countdownMode,
      globalPurchasedLabel: formatTokenAmount(reads.totalPurchased, USD1_DECIMALS, 0),
      globalPurchasedLoading: reads.globalPurchasedLoading,
      userTotalLabel: formatTokenAmount(reads.userTotal, USD1_DECIMALS, 0),
      userTotal: reads.userTotal,
      userPhaseAmountCurrent: reads.userPhaseAmountCurrent,
      seasonContributionMaxWei: reads.seasonContributionMaxWei,
      usd1BalanceLabel: reads.usd1BalanceKnown
        ? formatTokenAmount(reads.usd1Balance, USD1_DECIMALS, 2)
        : '',
      estimatedAgxLabel: formatNumber(estimatedAgx, { digits: 2 }),
      payUsd1Label: `${formatNumber(payUsd1, { digits: 0 })} USD1`,
      contributionValueLabel: formatNumber(contributionValueUsd, { prefix: '$' }),
      xTokenAirdropLabel: formatNumber(xTokenAirdropUsd, { prefix: '$' }),
      airdropThresholdUsd: reads.airdropThresholdUsd,
      airdropThresholdLoading: reads.airdropThresholdLoading,
      quotaLabel,
      minAmount: reads.minAmount,
      referencePriceLabel: formatNumber(reads.agxPriceUsd, { digits: 2, prefix: '$' }),
      airdropLabel: `+${(getAirdropBpsForPhase(reads.activePhase ?? undefined) / 100).toFixed(0)}%`,
      agxPriceUsd: reads.agxPriceUsd,
      activeSeasonNumber: reads.activeSeasonNumber,
      seasonOptions: reads.seasonOptions,
      isPhasesLoading: reads.isPhasesLoading,
    },
  }
}

export type SalesLogRowFormatOptions = {
  agxPriceUsd?: number
  phases?: ReadonlyArray<PresalePhaseOnChain>
}

function formatSalesLogAgx(item: SalesLogItem, options: SalesLogRowFormatOptions): string {
  const agxPriceUsd = options.agxPriceUsd ?? 0
  const tokens = Number(item.tokens)
  if (Number.isFinite(tokens) && tokens > 0) {
    return formatNumber(tokens, { digits: 2 })
  }

  const amountUsd1 = Number(item.amount)
  if (!Number.isFinite(amountUsd1) || amountUsd1 <= 0) return TABLE_EMPTY

  const estimated = estimateAgxFromUsd1(
    amountUsd1,
    phaseDiscountBps(item.phase_id, options.phases),
    agxPriceUsd,
  )
  return estimated > 0 ? formatNumber(estimated, { digits: 2 }) : TABLE_EMPTY
}

/**
 * 把销售记录映射为桌面表格行
 *
 * 列序为时间、金额、折扣、AGX 估算与交易哈希；
 * 交易哈希缺失或 AGX 无法估算时显示为空表标记。
 */
export function mapSalesLogToDesktopRow(
  item: SalesLogItem,
  options: SalesLogRowFormatOptions = {},
): ReactNode[] {
  return [
    formatBlockTime(item.block_time),
    formatNumber(Number(item.amount), { digits: 0, prefix: '$' }),
    formatDiscountBps(phaseDiscountBps(item.phase_id, options.phases)),
    formatSalesLogAgx(item, options),
    item.tx_hash ? <ExplorerLink key={item.tx_hash} kind="tx" value={item.tx_hash} /> : TABLE_EMPTY,
  ]
}

/** 创世贡献表列宽预设（16px 根字号）。 */
export const genesisContributionsColWidths = [
  '8.25rem',
  '6.5rem',
  '6rem',
  '8.5rem',
  '6.5rem',
] as const
