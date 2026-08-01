import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  canPurchaseGenesis,
  clampGenesisShares,
  estimateAgxFromUsd1,
  estimateContributionValueUsd,
  estimateXTokenAirdropUsd,
  getAirdropBpsForPhase,
  type PhaseCountdownMode,
  USD1_DECIMALS,
} from '~/core/presale/presale-math'
import { formatGroupedNumber } from '~/shared/api/format-display'
import type { useGenesisChainReads } from '~/views/dapp/genesis/use-genesis-chain-reads'

type GenesisReads = ReturnType<typeof useGenesisChainReads>

/** Pure display + block assembly from chain reads + share draft + countdown leaf. */
export function genesisPurchaseSummary(args: {
  reads: GenesisReads
  sharesDraft: number
  countdown: string
  countdownMode: PhaseCountdownMode | null
}) {
  const { reads, sharesDraft, countdown, countdownMode } = args
  const shares = clampGenesisShares(sharesDraft, reads.maxShares)
  const purchaseAmount = reads.sharePriceWei > 0n ? reads.sharePriceWei * BigInt(shares) : 0n
  const payUsd1 = formatTokenAmountToNumber(purchaseAmount, USD1_DECIMALS)
  const estimatedAgx = estimateAgxFromUsd1(payUsd1, reads.discountBps, reads.agxPriceUsd)
  const contributionValueUsd = estimateContributionValueUsd(
    payUsd1,
    reads.discountBps,
    reads.agxPriceUsd,
  )
  const xTokenAirdropUsd = estimateXTokenAirdropUsd(
    payUsd1,
    reads.phaseIndex,
    reads.activePhase ?? undefined,
  )
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
      estimatedAgxLabel: formatGroupedNumber(estimatedAgx, { digits: 2 }),
      payUsd1Label: `${formatGroupedNumber(payUsd1, { digits: 0 })} USD1`,
      contributionValueLabel: formatGroupedNumber(contributionValueUsd, { prefix: '$' }),
      xTokenAirdropLabel:
        payUsd1 > 0
          ? formatGroupedNumber(xTokenAirdropUsd, { prefix: '$' })
          : formatGroupedNumber(0, { prefix: '$' }),
      airdropThresholdUsd: reads.airdropThresholdUsd,
      airdropThresholdLoading: reads.airdropThresholdLoading,
      quotaLabel,
      referencePriceLabel: formatGroupedNumber(reads.agxPriceUsd, { digits: 2, prefix: '$' }),
      airdropLabel: `+${(getAirdropBpsForPhase(reads.phaseIndex, reads.activePhase ?? undefined) / 100).toFixed(0)}%`,
      agxPriceUsd: reads.agxPriceUsd,
      activeSeasonNumber: reads.activeSeasonNumber,
      seasonOptions: reads.seasonOptions,
      isPhasesLoading: reads.isPhasesLoading,
    },
  }
}
