import { useQueryClient } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  buildPhaseCountdownKey,
  clampGenesisShares,
  canPurchaseGenesis,
  estimateAgxFromUsd1,
  estimateContributionValueUsd,
  estimateXTokenAirdropUsd,
  formatPhaseCountdown,
  getAirdropBpsForPhase,
  hasPhaseCountdownElapsed,
  resolvePhaseCountdownTarget,
  presaleAirdropThresholdToUsd,
  resolveGenesisMaxShares,
  resolveRemainingPhaseAmount,
  resolveRemainingUserAmount,
  resolveSharePriceWei,
} from '~/core/presale/presale-math'
import { evaluateGenesisPostApproveGate } from '~/core/presale/presale-math'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/swap/token-amount'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/views/dapp/web3/presale-write'
import { MAX_UINT256 } from '~/views/dapp/web3/abis'
import { formatUsd } from '~/shared/api/format-display'
import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'
import { readErc20Allowance, readErc20Balance } from '~/views/dapp/web3/swap-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import { invalidatePresaleChainQueries } from '~/shared/api/query/invalidate'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresaleAirdropThresholdQuery,
  usePresalePausedQuery,
  usePresalePhasesQuery,
  usePresaleTotalPurchasedQuery,
  useIsBindReferralQuery,
  usePresaleUserPhaseRemainingQuery,
  usePresaleUserTotalQuery,
  useUsd1PresaleWalletQuery,
} from '~/hooks/queries/use-presale-queries'
import {
  invalidateAfterGenesisPhaseTransition,
  invalidateAfterGenesisPurchase,
} from '~/shared/api/query/invalidate'
import { useI18n } from '~/i18n/use-i18n'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { useDappShellStore } from '~/stores/dapp-shell-store'

export interface GenesisPurchaseResult {
  success: boolean
  /** Raw wallet / contract error — keep for selector-based i18n resolution. */
  error?: unknown
}

const USD1_DECIMALS = 18

/** Survives GenesisWidgetProvider unmount when user switches tabs mid-tx. */
const genesisPurchaseGate = { inFlight: false }

export function useGenesisWidget() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { messages: t } = useI18n()
  const queryClient = useQueryClient()
  const readClient = useChainReadClient()
  const countdownRefreshRef = useRef<string | null>(null)
  const [sharesDraft, setSharesDraft] = useState(0)
  const [submittingAction, setSubmittingAction] = useState<'approve' | 'purchase' | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Clock + chrome SSOT: GenesisPromoSync derives once into the store.
  const nowSeconds = useGenesisPromoStore((state) => state.nowSeconds)
  const activeSeasonNumber = useGenesisPromoStore((state) => state.activeSeasonNumber)
  const discountLabel = useGenesisPromoStore((state) => state.discountLabel)
  const seasonOptions = useGenesisPromoStore((state) => state.seasonOptions)

  const address = account?.address
  const walletReady = Boolean(address)
  const purchaseQueriesEnabled = useDappShellStore((state) => state.activeTab === 'genesis')

  // Provider only mounts on Genesis tab; keep enabled flags as belt-and-suspenders.
  const phasesQuery = usePresalePhasesQuery()
  const activePhaseQuery = usePresaleActivePhaseQuery()
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const totalPurchasedQuery = usePresaleTotalPurchasedQuery({
    enabled: purchaseQueriesEnabled,
  })
  const airdropThresholdQuery = usePresaleAirdropThresholdQuery({
    enabled: purchaseQueriesEnabled,
  })
  const pausedQuery = usePresalePausedQuery({ enabled: purchaseQueriesEnabled })
  const userTotalQuery = usePresaleUserTotalQuery(address, { enabled: purchaseQueriesEnabled })
  const phaseRemainingQuery = usePresaleUserPhaseRemainingQuery(
    address,
    activePhaseQuery.data?.index,
    { enabled: purchaseQueriesEnabled },
  )
  const { usd1Balance, allowance } = useUsd1PresaleWalletQuery(address, {
    enabled: purchaseQueriesEnabled,
  })
  const isBoundQuery = useIsBindReferralQuery(address, { enabled: purchaseQueriesEnabled })
  const isBound = isBoundQuery.data === true
  const needsReferralBind = walletReady && isBoundQuery.data === false
  const isPaused = pausedQuery.data === true
  // Fail-closed while pause status is unknown (loading, error, or never fetched).
  const isPausedUnknown = walletReady && !(pausedQuery.isSuccess && pausedQuery.data !== undefined)

  const phases = useMemo(() => phasesQuery.data ?? [], [phasesQuery.data])
  const activePhase = activePhaseQuery.data ?? null
  const sharePriceWei = resolveSharePriceWei(activePhase)
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
    (purchaseQueriesEnabled && walletReady && userTotalQuery.isLoading) ||
    (purchaseQueriesEnabled &&
      walletReady &&
      activePhase !== null &&
      phaseRemainingQuery.isLoading)

  const phaseIndex = activePhase?.index ?? 0
  const agxPriceUsd = useMemo(() => {
    const fromChain = formatTokenAmountToNumber(agxPriceWei, USD1_DECIMALS)
    return fromChain > 0 ? fromChain : 0
  }, [agxPriceWei])
  const discountBps = Number(activePhase?.discountBps ?? 0)
  const minAmount = activePhase?.minAmount ?? 0n
  const maxAmount = activePhase?.maxAmount ?? 0n
  const remainingPhaseAmount = resolveRemainingPhaseAmount(phaseRemaining, activePhase)
  const remainingUserAmount = resolveRemainingUserAmount(phaseRemaining, activePhase, maxAmount)
  const maxShares = useMemo(
    () =>
      resolveGenesisMaxShares({
        sharePriceWei,
        remainingPhaseAmount,
        remainingUserAmount,
        usd1Balance,
        walletReady,
      }),
    [remainingPhaseAmount, remainingUserAmount, sharePriceWei, usd1Balance, walletReady],
  )

  const shares = clampGenesisShares(sharesDraft, maxShares)
  const setShares = useCallback((next: number) => {
    setSharesDraft(next)
  }, [])

  const purchaseAmount = useMemo(
    () => (sharePriceWei > 0n ? sharePriceWei * BigInt(shares) : 0n),
    [sharePriceWei, shares],
  )
  const payUsd1 = formatTokenAmountToNumber(purchaseAmount, USD1_DECIMALS)
  const estimatedAgx = estimateAgxFromUsd1(payUsd1, discountBps, agxPriceUsd)
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
  const canPurchase = canPurchaseGenesis({
    walletReady,
    hasActivePhase: activePhase !== null,
    isBound,
    isPaused: isPaused || isPausedUnknown,
    maxShares,
    shares,
    purchaseAmount,
    minAmount,
    maxPurchasableWei,
  })
  const isSubmitting = submittingAction !== null

  const refresh = useCallback(async () => {
    invalidatePresaleChainQueries(address)
  }, [address])

  const approve = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (!account || !wallet) {
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
      await approveUsd1ForPresaleIfNeeded({ wallet, amount: purchaseAmount })
      if (address) {
        queryClient.setQueryData(
          queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
          MAX_UINT256,
        )
      }
      return { success: true }
    } catch (caught) {
      return { success: false, error: caught }
    } finally {
      setSubmittingAction(null)
    }
  }, [account, address, canPurchase, isApproved, purchaseAmount, queryClient, wallet])

  const purchase = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (!account || !wallet) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED }
    }
    if (!activePhase || !canPurchase) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    setSubmittingAction('purchase')
    setError(null)

    try {
      const [balance, approved] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, account.address, readClient),
        readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale, readClient),
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
        wallet,
        phase: activePhase.index,
        amount: purchaseAmount,
      })
      invalidateAfterGenesisPurchase(account.address, purchaseAmount)
      return { success: true }
    } catch (caught) {
      return { success: false, error: caught }
    } finally {
      setSubmittingAction(null)
    }
  }, [
    account,
    activePhase,
    address,
    canPurchase,
    purchaseAmount,
    queryClient,
    readClient,
    wallet,
  ])

  const submitPurchase = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (genesisPurchaseGate.inFlight) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    // Contract requires a bound referrer before purchase; block early with a
    // friendly prompt instead of letting the tx revert (PreSaleUserNotBound).
    // Fail-closed while bind status is still loading (`undefined`).
    if (isBoundQuery.data !== true) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.NOT_BOUND }
    }
    if (isPaused || isPausedUnknown) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    genesisPurchaseGate.inFlight = true
    try {
      if (needsApproval) {
        const approveResult = await approve()
        if (!approveResult.success) {
          return approveResult
        }
        const gate = evaluateGenesisPostApproveGate({
          isBound: isBoundQuery.data,
          isPaused,
          isPausedUnknown,
        })
        if (!gate.ok) {
          return {
            success: false,
            error:
              gate.reason === 'not_bound'
                ? GENESIS_PURCHASE_ERROR.NOT_BOUND
                : GENESIS_PURCHASE_ERROR.UNAVAILABLE,
          }
        }
      }
      return await purchase()
    } finally {
      genesisPurchaseGate.inFlight = false
    }
  }, [approve, isBoundQuery.data, isPaused, isPausedUnknown, needsApproval, purchase])

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
    invalidateAfterGenesisPhaseTransition(address)
  }, [address, countdownTarget, nowSeconds])

  const queryError =
    phasesQuery.error ??
    activePhaseQuery.error ??
    agxPriceQuery.error ??
    totalPurchasedQuery.error ??
    (purchaseQueriesEnabled ? userTotalQuery.error : null) ??
    (purchaseQueriesEnabled ? phaseRemainingQuery.error : null)

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
      ? formatPhaseCountdown(countdownTarget.targetTime, nowSeconds, t.genesis.countdownUnits)
      : '—',
    countdownMode: countdownTarget?.mode ?? null,
    globalPurchasedLabel: formatTokenAmount(totalPurchasedQuery.data ?? 0n, USD1_DECIMALS, 0),
    globalPurchasedLoading: totalPurchasedQuery.isLoading,
    userTotalLabel: formatTokenAmount(userTotal, USD1_DECIMALS, 0),
    userTotal,
    userPhaseAmountCurrent: phaseRemaining?.userPhaseAmountCurrent ?? 0n,
    seasonContributionMaxWei:
      phaseRemaining && phaseRemaining.userPurchaseLimit > 0n
        ? phaseRemaining.userPurchaseLimit
        : maxAmount,
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
    error: queryError ?? error,
    refresh,
    approve,
    purchase,
    submitPurchase,
    activeSeasonNumber,
    seasonOptions,
    isPhasesLoading: phasesQuery.isLoading,
  }
}
