import type { ReactNode } from 'react'

import {
  formatTokenAmount,
  formatTokenAmountToNumber,
  PERSONAL_TOKEN_DIGITS,
} from '~/core/exchange/token-amount'
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
        ? formatTokenAmount(reads.usd1Balance, USD1_DECIMALS, PERSONAL_TOKEN_DIGITS)
        : '',
      estimatedAgxLabel: formatNumber(estimatedAgx, { digits: PERSONAL_TOKEN_DIGITS }),
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
    return formatNumber(tokens, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' AGX' })
  }

  const amountUsd1 = Number(item.amount)
  if (!Number.isFinite(amountUsd1) || amountUsd1 <= 0) {
    return formatNumber(0, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' AGX' })
  }

  const estimated = estimateAgxFromUsd1(
    amountUsd1,
    phaseDiscountBps(item.phase_id, options.phases),
    agxPriceUsd,
  )
  return estimated > 0
    ? formatNumber(estimated, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' AGX' })
    : formatNumber(0, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' AGX' })
}

/**
 * 把销售记录映射为桌面表格行
 *
 * 列序为时间、金额、折扣、AGX 估算与交易哈希；
 * AGX 无法估算时显 0；交易哈希缺失仍为空表标记。
 */
export function mapSalesLogToDesktopRow(
  item: SalesLogItem,
  options: SalesLogRowFormatOptions = {},
): ReactNode[] {
  return [
    formatBlockTime(item.block_time),
    formatNumber(Number(item.amount), { digits: 0, prefix: '$' }),
    formatDiscountBps(phaseDiscountBps(item.phase_id, options.phases), { signed: false }),
    formatSalesLogAgx(item, options),
    item.tx_hash ? <ExplorerLink key={item.tx_hash} kind="tx" value={item.tx_hash} /> : TABLE_EMPTY,
  ]
}
