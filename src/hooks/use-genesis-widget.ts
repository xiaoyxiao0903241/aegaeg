import { useQueryClient } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BSC_CONTRACTS } from '~/config/contracts'
import { PRESALE_CONFIG } from '~/config/presale'
import {
  buildPhaseCountdownKey,
  estimateAgxFromUsd1,
  estimateContributionValueUsd,
  estimateXTokenAirdropUsd,
  formatPhaseCountdown,
  getAirdropBpsForPhase,
  hasPhaseCountdownElapsed,
  resolvePhaseCountdownTarget,
  presaleAirdropThresholdToUsd,
  resolveGenesisMaxShares,
  resolveRemainingUserAmount,
} from '~/lib/presale/presale-math'
import { buildSeasonOptions } from '~/lib/presale/season-options'
import { buildGenesisPromoSnapshot } from '~/lib/presale/genesis-promo'
import { formatTokenAmount, formatTokenAmountToNumber, parseTokenAmount } from '~/lib/swap/token-amount'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/web3/presale-write'
import { MAX_UINT256 } from '~/web3/abis'
import { formatUsd } from '~/lib/api/format-display'
import { GENESIS_PURCHASE_ERROR } from '~/lib/web3/resolve-contract-error-message'
import { readErc20Allowance, readErc20Balance } from '~/web3/swap-read'
import { queryKeys } from '~/lib/query/query-keys'
import { invalidatePresaleChainQueries } from '~/lib/query/invalidate'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresaleAirdropThresholdQuery,
  usePresalePhasesQuery,
  usePresaleTotalPurchasedQuery,
  useIsBindReferralQuery,
  usePresaleUserPhaseRemainingQuery,
  usePresaleUserTotalQuery,
  useUsd1PresaleWalletQuery,
} from '~/hooks/queries/use-presale-queries'
import { useDappActions } from '~/stores/dapp-actions'

export interface GenesisPurchaseResult {
  success: boolean
  error?: string
}

const USD1_DECIMALS = 18

export function useGenesisWidget() {
  const account = useActiveAccount()
  const queryClient = useQueryClient()
  const afterGenesisPurchase = useDappActions((state) => state.afterGenesisPurchase)
  const afterGenesisPhaseTransition = useDappActions((state) => state.afterGenesisPhaseTransition)
  const countdownRefreshRef = useRef<string | null>(null)
  const [shares, setShares] = useState(1)
  const [submittingAction, setSubmittingAction] = useState<'approve' | 'purchase' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000))

  const address = account?.address
  const walletReady = Boolean(address)
  const phasesQuery = usePresalePhasesQuery()
  const activePhaseQuery = usePresaleActivePhaseQuery()
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const totalPurchasedQuery = usePresaleTotalPurchasedQuery()
  const airdropThresholdQuery = usePresaleAirdropThresholdQuery()
  const userTotalQuery = usePresaleUserTotalQuery(address)
  const phaseRemainingQuery = usePresaleUserPhaseRemainingQuery(
    address,
    activePhaseQuery.data?.index,
  )
  const purchaseAmount = useMemo(
    () => parseTokenAmount(String(shares * Number(PRESALE_CONFIG.sharePriceUsd1)), USD1_DECIMALS),
    [shares],
  )
  const { usd1Balance, allowance } = useUsd1PresaleWalletQuery(address)
  const isBoundQuery = useIsBindReferralQuery(address)
  const isBound = isBoundQuery.data
  const needsReferralBind = walletReady && isBound === false

  const phases = phasesQuery.data ?? []
  const activePhase = activePhaseQuery.data ?? null
  const userTotal = userTotalQuery.data ?? 0n
  const phaseRemaining = phaseRemainingQuery.data ?? null
  const agxPriceWei = agxPriceQuery.data ?? 0n
  const airdropThresholdUsd = useMemo(
    () =>
      airdropThresholdQuery.data !== undefined
        ? presaleAirdropThresholdToUsd(airdropThresholdQuery.data)
        : presaleAirdropThresholdToUsd(0n),
    [airdropThresholdQuery.data],
  )

  const isLoading =
    phasesQuery.isLoading ||
    activePhaseQuery.isLoading ||
    agxPriceQuery.isLoading ||
    totalPurchasedQuery.isLoading ||
    (walletReady && userTotalQuery.isLoading) ||
    (walletReady && activePhase !== null && phaseRemainingQuery.isLoading)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const phaseIndex = activePhase?.index ?? 0
  const agxPriceUsd = useMemo(() => {
    const fromChain = formatTokenAmountToNumber(agxPriceWei, USD1_DECIMALS)
    return fromChain > 0 ? fromChain : Number(PRESALE_CONFIG.agxPriceUsd)
  }, [agxPriceWei])
  const discountBps = Number(activePhase?.discountBps ?? PRESALE_CONFIG.phases[0]?.discountBps ?? 0)
  const discountLabel = `-${(discountBps / 100).toFixed(0)}%`
  const minAmount =
    activePhase?.minAmount ??
    parseTokenAmount(PRESALE_CONFIG.phases[0]?.minUsd1 ?? '100', USD1_DECIMALS)
  const maxAmount =
    activePhase?.maxAmount ??
    parseTokenAmount(PRESALE_CONFIG.phases[0]?.maxUsd1 ?? '10000', USD1_DECIMALS)
  const remainingPhaseAmount =
    phaseRemaining?.remainingPhaseAmount ??
    (activePhase ? activePhase.maxAmount - activePhase.soldAmount : 0n)
  const remainingUserAmount = resolveRemainingUserAmount(phaseRemaining, activePhase, maxAmount)
  const maxShares = useMemo(
    () =>
      resolveGenesisMaxShares({
        remainingPhaseAmount,
        remainingUserAmount,
        usd1Balance,
        walletReady,
      }),
    [remainingPhaseAmount, remainingUserAmount, usd1Balance, walletReady],
  )

  useEffect(() => {
    if (maxShares <= 0) return
    setShares((current) => Math.min(Math.max(current, 1), maxShares))
  }, [maxShares])

  const estimatedAgx = estimateAgxFromUsd1(
    shares * Number(PRESALE_CONFIG.sharePriceUsd1),
    discountBps,
    agxPriceUsd,
  )
  const payUsd1 = shares * Number(PRESALE_CONFIG.sharePriceUsd1)
  const contributionValueUsd = estimateContributionValueUsd(
    payUsd1,
    discountBps,
    agxPriceUsd,
  )
  const xTokenAirdropUsd = estimateXTokenAirdropUsd(
    payUsd1,
    phaseIndex,
    activePhase ?? undefined,
  )
  const maxPurchasableWei =
    remainingPhaseAmount < remainingUserAmount
      ? remainingPhaseAmount
      : remainingUserAmount
  const quotaLabel = `$${formatTokenAmount(minAmount, USD1_DECIMALS, 0)} – $${formatTokenAmount(maxAmount, USD1_DECIMALS, 0)}`
  const isApproved = walletReady && purchaseAmount > 0n && allowance >= purchaseAmount
  const needsApproval = walletReady && purchaseAmount > 0n && !isApproved
  const hasSufficientBalance = usd1Balance >= purchaseAmount
  const canPurchase =
    walletReady &&
    activePhase !== null &&
    maxShares > 0 &&
    purchaseAmount >= minAmount &&
    purchaseAmount <= maxPurchasableWei &&
    shares <= maxShares
  const isSubmitting = submittingAction !== null

  const refresh = useCallback(async () => {
    invalidatePresaleChainQueries(address)
  }, [address])

  const approve = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (!account) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED }
    }
    if (!canPurchase) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }
    if (isApproved) {
      return { success: true }
    }

    setSubmittingAction('approve')
    setError(null)

    try {
      await approveUsd1ForPresaleIfNeeded({ account, amount: purchaseAmount })
      if (address) {
        queryClient.setQueryData(
          queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
          MAX_UINT256,
        )
      }
      return { success: true }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Approve failed'
      return { success: false, error: message }
    } finally {
      setSubmittingAction(null)
    }
  }, [account, address, canPurchase, isApproved, purchaseAmount, queryClient])

  const purchase = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (!account) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED }
    }
    if (!activePhase || !canPurchase) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    setSubmittingAction('purchase')
    setError(null)

    try {
      const [balance, approved] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, account.address),
        readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale),
      ])

      if (address) {
        queryClient.setQueryData(
          queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address),
          balance,
        )
        queryClient.setQueryData(
          queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
          approved,
        )
      }

      if (approved < purchaseAmount) {
        return { success: false, error: GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE }
      }

      if (balance < purchaseAmount) {
        return { success: false, error: GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1 }
      }

      await purchasePresale({
        account,
        phase: activePhase.index,
        amount: purchaseAmount,
      })
      afterGenesisPurchase(account.address, purchaseAmount)
      await refresh()
      return { success: true }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Purchase failed'
      return { success: false, error: message }
    } finally {
      setSubmittingAction(null)
    }
  }, [
    account,
    activePhase,
    address,
    afterGenesisPurchase,
    canPurchase,
    purchaseAmount,
    queryClient,
    refresh,
  ])

  const participate = useCallback(async (): Promise<GenesisPurchaseResult> => {
    // Contract requires a bound referrer before purchase; block early with a
    // friendly prompt instead of letting the tx revert (PreSaleUserNotBound).
    if (isBound === false) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.NOT_BOUND }
    }
    if (needsApproval) {
      const approveResult = await approve()
      if (!approveResult.success) {
        return approveResult
      }
    }
    return purchase()
  }, [approve, isBound, needsApproval, purchase])

  const countdownTarget = resolvePhaseCountdownTarget(phases, nowSeconds)

  useEffect(() => {
    if (!countdownTarget || !hasPhaseCountdownElapsed(countdownTarget.targetTime, nowSeconds)) {
      return
    }

    const countdownKey = buildPhaseCountdownKey(countdownTarget)
    if (!countdownKey || countdownRefreshRef.current === countdownKey) {
      return
    }

    countdownRefreshRef.current = countdownKey
    afterGenesisPhaseTransition(address)
  }, [address, afterGenesisPhaseTransition, countdownTarget, nowSeconds])

  const seasonOptions = useMemo(
    () => buildSeasonOptions(phases, agxPriceUsd, nowSeconds),
    [agxPriceUsd, nowSeconds, phases],
  )

  const activeSeasonNumber = useMemo(() => {
    if (activePhase) return phaseIndex + 1
    const liveSeason = seasonOptions.find((season) => season.active)
    const match = liveSeason?.name.match(/Season (\d+)/)
    return match ? Number(match[1]) : 1
  }, [activePhase, phaseIndex, seasonOptions])

  const promoSnapshot = useMemo(
    () => buildGenesisPromoSnapshot(phases, activePhase, nowSeconds),
    [activePhase, nowSeconds, phases],
  )

  const queryError =
    phasesQuery.error ??
    activePhaseQuery.error ??
    agxPriceQuery.error ??
    totalPurchasedQuery.error ??
    userTotalQuery.error ??
    phaseRemainingQuery.error

  return {
    shares,
    setShares,
    maxShares,
    phases,
    activePhase,
    phaseIndex,
    discountLabel,
    discountBps,
    countdown: countdownTarget
      ? formatPhaseCountdown(countdownTarget.targetTime, nowSeconds)
      : '—',
    countdownMode: countdownTarget?.mode ?? null,
    globalPurchasedLabel: formatTokenAmount(totalPurchasedQuery.data ?? 0n, USD1_DECIMALS, 0),
    globalPurchasedLoading: totalPurchasedQuery.isLoading,
    userTotalLabel: formatTokenAmount(userTotal, USD1_DECIMALS, 0),
    userTotal,
    usd1BalanceLabel: formatTokenAmount(usd1Balance, USD1_DECIMALS, 2),
    estimatedAgxLabel: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(estimatedAgx),
    payUsd1Label: `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(payUsd1)} USD1`,
    contributionValueLabel: formatUsd(contributionValueUsd),
    xTokenAirdropLabel: payUsd1 > 0 ? formatUsd(xTokenAirdropUsd) : '—',
    airdropThresholdUsd,
    airdropThresholdLoading: airdropThresholdQuery.isLoading,
    quotaLabel,
    referencePriceLabel: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(agxPriceUsd)}`,
    airdropLabel: `+${(getAirdropBpsForPhase(phaseIndex, activePhase ?? undefined) / 100).toFixed(0)}%`,
    agxPriceUsd,
    walletReady,
    needsReferralBind,
    needsApproval,
    isApproved,
    hasSufficientBalance,
    canPurchase,
    isLoading,
    isSubmitting,
    submittingAction,
    error:
      error ??
      (queryError instanceof Error ? queryError.message : queryError ? 'Failed to load presale data' : null),
    refresh,
    approve,
    purchase,
    participate,
    activeSeasonNumber,
    seasonOptions: seasonOptions,
    promoSnapshot,
  }
}
