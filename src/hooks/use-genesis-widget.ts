import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BSC_CONTRACTS } from '../config/contracts'
import { PRESALE_CONFIG } from '../config/presale'
import {
  estimateAgxFromUsd1,
  formatPhaseCountdown,
  resolvePhaseCountdownTarget,
  type PresalePhaseOnChain,
} from '../lib/presale/presale-math'
import {
  buildSeasonOptions,
  getAirdropLabelForPhase,
} from '../lib/presale/season-options'
import { buildGenesisPromoSnapshot } from '../lib/presale/genesis-promo'
import { formatTokenAmount, parseTokenAmount } from '../lib/swap/token-amount'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '../web3/presale-write'
import { MAX_UINT256 } from '../web3/abis'
import {
  readActivePresalePhase,
  readAllPresalePhases,
  readPresaleAgxPriceWei,
  readUserPresaleTotal,
} from '../web3/presale-read'
import { GENESIS_PURCHASE_ERROR } from '../lib/web3/resolve-contract-error-message'
import { readErc20Allowance, readErc20Balance } from '../web3/swap-read'

export interface GenesisPurchaseResult {
  success: boolean
  error?: string
}

const USD1_DECIMALS = 18

export function useGenesisWidget(connected: boolean, enabled = true) {
  const account = useActiveAccount()
  const [shares, setShares] = useState(1)
  const [phases, setPhases] = useState<PresalePhaseOnChain[]>([])
  const [activePhase, setActivePhase] = useState<PresalePhaseOnChain | null>(null)
  const [userTotal, setUserTotal] = useState<bigint>(0n)
  const [usd1Balance, setUsd1Balance] = useState<bigint>(0n)
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [agxPriceWei, setAgxPriceWei] = useState<bigint>(0n)
  const [isLoading, setIsLoading] = useState(false)
  const [submittingAction, setSubmittingAction] = useState<'approve' | 'purchase' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000))

  const purchaseAmount = useMemo(
    () => parseTokenAmount(String(shares * Number(PRESALE_CONFIG.sharePriceUsd1)), USD1_DECIMALS),
    [shares],
  )

  const refresh = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const [allPhases, active, total, agxPrice] = await Promise.all([
        readAllPresalePhases(),
        readActivePresalePhase(),
        connected && account?.address
          ? readUserPresaleTotal(account.address)
          : Promise.resolve(0n),
        readPresaleAgxPriceWei(),
      ])

      setPhases(allPhases)
      setActivePhase(active)
      setUserTotal(total)
      setAgxPriceWei(agxPrice)

      if (connected && account?.address) {
        const [balance, approved] = await Promise.all([
          readErc20Balance(BSC_CONTRACTS.usd1, account.address),
          readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale),
        ])
        setUsd1Balance(balance)
        setAllowance(approved)
      } else {
        setUsd1Balance(0n)
        setAllowance(0n)
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load presale data')
    } finally {
      setIsLoading(false)
    }
  }, [account?.address, connected, enabled])

  useEffect(() => {
    if (!enabled) return
    void refresh()
  }, [enabled, refresh])

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
  const isApproved = purchaseAmount > 0n && allowance >= purchaseAmount
  const needsApproval = purchaseAmount > 0n && !isApproved
  const hasSufficientBalance = usd1Balance >= purchaseAmount
  const canPurchase =
    connected && activePhase !== null && purchaseAmount >= minAmount && purchaseAmount <= maxAmount
  const isSubmitting = submittingAction !== null

  useEffect(() => {
    if (!connected || !account?.address) return

    void readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale).then(
      setAllowance,
    )
  }, [account?.address, connected, purchaseAmount])

  const approve = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (!account || !canPurchase || isApproved) {
      return { success: false }
    }

    setSubmittingAction('approve')
    setError(null)

    try {
      await approveUsd1ForPresaleIfNeeded({ account, amount: purchaseAmount })
      setAllowance(MAX_UINT256)
      await refresh()
      return { success: true }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Approve failed'
      return { success: false, error: message }
    } finally {
      setSubmittingAction(null)
    }
  }, [account, canPurchase, isApproved, purchaseAmount, refresh])

  const purchase = useCallback(async (): Promise<GenesisPurchaseResult> => {
    if (!account || !activePhase || !canPurchase) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    setSubmittingAction('purchase')
    setError(null)

    try {
      const [balance, approved] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, account.address),
        readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale),
      ])
      setUsd1Balance(balance)
      setAllowance(approved)

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
      await refresh()
      return { success: true }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Purchase failed'
      return { success: false, error: message }
    } finally {
      setSubmittingAction(null)
    }
  }, [account, activePhase, canPurchase, purchaseAmount, refresh])

  const countdownTarget = resolvePhaseCountdownTarget(phases, nowSeconds)

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
    globalPurchasedLabel: formatTokenAmount(
      phases[phaseIndex]?.purchasedAmount ?? 0n,
      USD1_DECIMALS,
      0,
    ),
    userTotalLabel: formatTokenAmount(userTotal, USD1_DECIMALS, 0),
    userTotal,
    usd1BalanceLabel: formatTokenAmount(usd1Balance, USD1_DECIMALS, 2),
    estimatedAgxLabel: estimatedAgx.toFixed(2),
    payUsd1Label: `${shares * Number(PRESALE_CONFIG.sharePriceUsd1)} USD1`,
    quotaLabel: `$${Number(formatTokenAmount(minAmount, USD1_DECIMALS, 0)).toLocaleString('en-US')} – $${Number(formatTokenAmount(maxAmount, USD1_DECIMALS, 0)).toLocaleString('en-US')}`,
    referencePriceLabel: `$${agxPriceUsd.toFixed(2)}`,
    airdropLabel: getAirdropLabelForPhase(phaseIndex),
    agxPriceUsd,
    needsApproval,
    isApproved,
    hasSufficientBalance,
    canPurchase,
    isLoading,
    isSubmitting,
    submittingAction,
    error,
    refresh,
    approve,
    purchase,
    activeSeasonNumber,
    seasonOptions: seasonOptions,
    promoSnapshot,
  }
}
