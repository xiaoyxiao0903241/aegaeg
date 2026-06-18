import { useQueryClient } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BSC_CONTRACTS } from '~/config/contracts'
import { PRESALE_CONFIG } from '~/config/presale'
import {
  buildPhaseCountdownKey,
  estimateAgxFromUsd1,
  estimateContributionValueUsd,
  resolveXTokenAirdropUsdForPurchase,
  formatPhaseCountdown,
  hasPhaseCountdownElapsed,
  resolvePhaseCountdownTarget,
} from '~/lib/presale/presale-math'
import {
  buildSeasonOptions,
  calcActivePhaseProgressPercent,
  getAirdropLabelForPhase,
} from '~/lib/presale/season-options'
import { buildGenesisPromoSnapshot } from '~/lib/presale/genesis-promo'
import { formatTokenAmount, parseTokenAmount } from '~/lib/swap/token-amount'
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
  usePresalePhasesQuery,
  usePresaleTotalPurchasedQuery,
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
  const userTotalQuery = usePresaleUserTotalQuery(address)
  const { usd1Balance, allowance } = useUsd1PresaleWalletQuery(address)

  const phases = phasesQuery.data ?? []
  const activePhase = activePhaseQuery.data ?? null
  const userTotal = userTotalQuery.data ?? 0n
  const agxPriceWei = agxPriceQuery.data ?? 0n

  const isLoading =
    phasesQuery.isLoading ||
    activePhaseQuery.isLoading ||
    agxPriceQuery.isLoading ||
    totalPurchasedQuery.isLoading ||
    (walletReady && userTotalQuery.isLoading)

  const purchaseAmount = useMemo(
    () => parseTokenAmount(String(shares * Number(PRESALE_CONFIG.sharePriceUsd1)), USD1_DECIMALS),
    [shares],
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const phaseIndex = activePhase?.index ?? 0
  const agxPriceUsd = useMemo(() => {
    const fromChain = Number(formatTokenAmount(agxPriceWei, USD1_DECIMALS, 2))
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
  const periodContributedUsd = Number(formatTokenAmount(userTotal, USD1_DECIMALS, 0))
  const xTokenAirdropUsd = resolveXTokenAirdropUsdForPurchase(
    periodContributedUsd,
    payUsd1,
    phaseIndex,
  )
  const activePhaseProgressPercent = calcActivePhaseProgressPercent(activePhase)
  const quotaRangeLabel = `$${Number(formatTokenAmount(minAmount, USD1_DECIMALS, 0)).toLocaleString('en-US')} – $${Number(formatTokenAmount(maxAmount, USD1_DECIMALS, 0)).toLocaleString('en-US')}`
  const isApproved = walletReady && purchaseAmount > 0n && allowance >= purchaseAmount
  const needsApproval = walletReady && purchaseAmount > 0n && !isApproved
  const hasSufficientBalance = usd1Balance >= purchaseAmount
  const canPurchase =
    walletReady &&
    activePhase !== null &&
    purchaseAmount >= minAmount &&
    purchaseAmount <= maxAmount
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
    userTotalQuery.error

  return {
    shares,
    setShares,
    phases,
    activePhase,
    phaseIndex,
    discountLabel,
    discountBps,
    countdown: countdownTarget
      ? formatPhaseCountdown(countdownTarget.targetTime, nowSeconds)
      : '—',
    countdownMode: countdownTarget?.mode ?? null,
    globalPurchasedLabel: Number(
      formatTokenAmount(totalPurchasedQuery.data ?? 0n, USD1_DECIMALS, 0),
    ).toLocaleString('en-US'),
    globalPurchasedLoading: totalPurchasedQuery.isLoading,
    userTotalLabel: formatTokenAmount(userTotal, USD1_DECIMALS, 0),
    userTotal,
    usd1BalanceLabel: formatTokenAmount(usd1Balance, USD1_DECIMALS, 2),
    estimatedAgxLabel: estimatedAgx.toFixed(2),
    payUsd1Label: `${payUsd1} USD1`,
    contributionValueLabel: formatUsd(contributionValueUsd),
    xTokenAirdropLabel: xTokenAirdropUsd > 0 ? formatUsd(xTokenAirdropUsd) : '—',
    activePhaseProgressPercent,
    quotaLabel: activePhase
      ? `${quotaRangeLabel} · ${activePhaseProgressPercent}%`
      : quotaRangeLabel,
    referencePriceLabel: `$${agxPriceUsd.toFixed(2)}`,
    airdropLabel: getAirdropLabelForPhase(phaseIndex),
    agxPriceUsd,
    walletReady,
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
    activeSeasonNumber,
    seasonOptions: seasonOptions,
    promoSnapshot,
  }
}
