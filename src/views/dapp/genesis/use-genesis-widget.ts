import { useEffect, useRef, useState } from 'react'
import { useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import {
  USD1_DECIMALS,
  buildPhaseCountdownKey,
  clampGenesisShares,
  canPurchaseGenesis,
  estimateAgxFromUsd1,
  estimateContributionValueUsd,
  estimateXTokenAirdropUsd,
  formatPhaseCountdown,
  getAirdropBpsForPhase,
  hasPhaseCountdownElapsed,
} from '~/core/presale/presale-math'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/swap/token-amount'
import { formatUsd } from '~/shared/api/format-display'
import { invalidateAfterGenesisPhaseTransition } from '~/shared/api/query/invalidate'
import { useI18n } from '~/i18n/use-i18n'
import { useGenesisChainReads } from '~/views/dapp/genesis/use-genesis-chain-reads'
import {
  useGenesisPurchaseActions,
  type GenesisPurchaseResult,
} from '~/views/dapp/genesis/use-genesis-purchase-actions'

export type { GenesisPurchaseResult }

/** Assembles Genesis reads + purchase actions; public API unchanged for context consumers. */
export function useGenesisWidget() {
  const { messages: t } = useI18n()
  const wallet = useActiveWallet()
  const reads = useGenesisChainReads()
  const countdownRefreshRef = useRef<string | null>(null)
  const [sharesDraft, setSharesDraft] = useState(0)

  const shares = clampGenesisShares(sharesDraft, reads.maxShares)
  function setShares(next: number) {
    setSharesDraft(next)
  }

  const purchaseAmount =
    reads.sharePriceWei > 0n ? reads.sharePriceWei * BigInt(shares) : 0n
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

  const actions = useGenesisPurchaseActions({
    account: reads.account,
    wallet,
    address: reads.address,
    activePhase: reads.activePhase,
    canPurchase,
    isApproved,
    needsApproval,
    purchaseAmount,
    isBoundQueryData: reads.isBoundQueryData,
    isPaused: reads.isPaused,
    isPausedUnknown: reads.isPausedUnknown,
  })

  useEffect(() => {
    const countdownTarget = reads.countdownTarget
    if (
      !countdownTarget ||
      !hasPhaseCountdownElapsed(countdownTarget.targetTime, reads.nowSeconds)
    ) {
      return
    }

    const countdownKey = buildPhaseCountdownKey(countdownTarget)
    if (!countdownKey || countdownRefreshRef.current === countdownKey) {
      return
    }

    countdownRefreshRef.current = countdownKey
    invalidateAfterGenesisPhaseTransition(reads.address)
  }, [reads.address, reads.countdownTarget, reads.nowSeconds])

  return {
    shares,
    setShares,
    maxShares: reads.maxShares,
    phases: reads.phases,
    activePhase: reads.activePhase,
    phaseIndex: reads.phaseIndex,
    discountLabel: reads.discountLabel,
    discountBps: reads.discountBps,
    countdown: reads.countdownTarget
      ? formatPhaseCountdown(
          reads.countdownTarget.targetTime,
          reads.nowSeconds,
          t.genesis.countdownUnits,
        )
      : '—',
    countdownMode: reads.countdownTarget?.mode ?? null,
    globalPurchasedLabel: formatTokenAmount(reads.totalPurchased, USD1_DECIMALS, 0),
    globalPurchasedLoading: reads.globalPurchasedLoading,
    userTotalLabel: formatTokenAmount(reads.userTotal, USD1_DECIMALS, 0),
    userTotal: reads.userTotal,
    userPhaseAmountCurrent: reads.userPhaseAmountCurrent,
    seasonContributionMaxWei: reads.seasonContributionMaxWei,
    usd1BalanceLabel: formatTokenAmount(reads.usd1Balance, USD1_DECIMALS, 2),
    estimatedAgxLabel: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(estimatedAgx),
    payUsd1Label: `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(payUsd1)} USD1`,
    contributionValueLabel: formatUsd(contributionValueUsd),
    xTokenAirdropLabel: payUsd1 > 0 ? formatUsd(xTokenAirdropUsd) : '—',
    airdropThresholdUsd: reads.airdropThresholdUsd,
    airdropThresholdLoading: reads.airdropThresholdLoading,
    quotaLabel,
    referencePriceLabel: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(reads.agxPriceUsd)}`,
    airdropLabel: `+${(getAirdropBpsForPhase(reads.phaseIndex, reads.activePhase ?? undefined) / 100).toFixed(0)}%`,
    agxPriceUsd: reads.agxPriceUsd,
    walletReady: reads.walletReady,
    needsReferralBind: reads.needsReferralBind,
    needsApproval,
    isApproved,
    hasSufficientBalance,
    canPurchase,
    isLoading: reads.isLoading,
    isSubmitting: actions.isSubmitting,
    submittingAction: actions.submittingAction,
    error: reads.error,
    refresh: actions.refresh,
    approve: actions.approve,
    purchase: actions.purchase,
    submitPurchase: actions.submitPurchase,
    activeSeasonNumber: reads.activeSeasonNumber,
    seasonOptions: reads.seasonOptions,
    isPhasesLoading: reads.isPhasesLoading,
  }
}
