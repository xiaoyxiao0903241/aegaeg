import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { dappAssets } from '~/app/assets'
import {
  readTurbineCooldownDuration,
  readTurbineQuota,
  readTurbineSilences,
  readTurbineUsd1Balances,
  readTurbineUsdQuote,
} from '~/web3/exchange/turbine-exchange-read'
import {
  submitTurbineClaim,
  submitTurbineUnlock,
} from '~/views/dapp/exchange/turbine/submit-turbine-exchange'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { WalletTransactionWaitError } from '~/web3/wallet/wait-wallet-transaction'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
} from '~/web3/wallet/unknown-receipt-lock'

export type TurbineSegment = 'unlock' | 'claim'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/** Turbine unlock (USD1→AGX cooldown) + claim cooled gAGX — handbook §16. */
export function useTurbineExchangeWidget(sessionReady: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()
  const address = account?.address
  const walletReady = hasWalletAccount(account)

  const [segment, setSegment] = useState<TurbineSegment>('unlock')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<unknown>(null)
  const [blockResubmit, setBlockResubmit] = useState(false)
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)

  const quotaQuery = useQuery({
    queryKey: queryKeys.chain.turbineQuota(address ?? ''),
    queryFn: () => readTurbineQuota(address!, readClient),
    enabled: quotesEnabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.turbineUsd1Balances(address ?? ''),
    queryFn: () => readTurbineUsd1Balances(address!, readClient),
    enabled: quotesEnabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const silencesQuery = useQuery({
    queryKey: queryKeys.chain.turbineSilences(address ?? ''),
    queryFn: () => readTurbineSilences(address!, readClient),
    enabled: quotesEnabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const cooldownQuery = useQuery({
    queryKey: queryKeys.chain.turbineCooldown,
    queryFn: () => readTurbineCooldownDuration(readClient),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
  })

  const quota = quotaQuery.data ?? 0n
  const usd1Balance = balancesQuery.data?.usd1 ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined && quotaQuery.data !== undefined
  const isBalancesLoading = walletReady && (balancesQuery.isLoading || quotaQuery.isLoading)

  const {
    amount: unlockAmount,
    amountIn: unlockAmountIn,
    setAmount: setUnlockAmount,
    clearAmount,
    fillPercent,
  } = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance: quota,
    balancesLoaded,
    sessionReady,
    onBeforeCap: () => setSubmitError(null),
  })

  const quoteQuery = useQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(unlockAmountIn.toString()),
    queryFn: () => readTurbineUsdQuote(unlockAmountIn, readClient),
    enabled: quotesEnabled && sessionReady && unlockAmountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
  })

  const usdNeeded = quoteQuery.data ?? 0n
  const buyAgxLabel =
    unlockAmountIn > 0n ? formatTokenAmount(unlockAmountIn, AGX_DECIMALS, 4) : '0.00'
  const payUsd1Label = unlockAmountIn > 0n ? formatTokenAmount(usdNeeded, USD1_DECIMALS, 4) : '0.00'

  const cooldownSeconds = Number(cooldownQuery.data ?? silencesQuery.data?.cooldownDuration ?? 0n)
  const cooldownHoursLabel = cooldownSeconds > 0 ? `${Math.round(cooldownSeconds / 3600)}h` : '—'

  const coolingBalance =
    silencesQuery.data?.rows.reduce(
      (sum, row) => (row.vested ? sum : sum + row.silenceBalance),
      0n,
    ) ?? 0n
  const claimableBalance =
    silencesQuery.data?.rows.reduce(
      (sum, row) => (row.vested ? sum + row.silenceBalance : sum),
      0n,
    ) ?? 0n

  const canUnlock =
    sessionReady &&
    walletReady &&
    writeReady &&
    !isSubmitting &&
    !blockResubmit &&
    unlockAmountIn > 0n &&
    unlockAmountIn <= quota &&
    usdNeeded > 0n &&
    usdNeeded <= usd1Balance &&
    !quoteQuery.isFetching

  async function runSubmit(run: () => Promise<void>) {
    if (isUnknownReceiptLocked(WRITE_PATH.EXCHANGE)) {
      setBlockResubmit(true)
      return { ok: false as const, error: new Error('UNKNOWN_RECEIPT_LOCKED') }
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await run()
      clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
      clearAmount()
      return { ok: true as const }
    } catch (error) {
      if (isUnknownSubmitOutcome(error) || error instanceof WalletTransactionWaitError) {
        lockUnknownReceipt(WRITE_PATH.EXCHANGE)
        setBlockResubmit(true)
      }
      setSubmitError(error)
      return { ok: false as const, error }
    } finally {
      setIsSubmitting(false)
      setClaimingIndex(null)
    }
  }

  async function submitUnlock() {
    return submitTurbineUnlock({
      account,
      wallet,
      core: { setSubmitError, runSubmit },
      usdAmount: usdNeeded,
      usd1Balance,
      refetchBalances: () => balancesQuery.refetch(),
      refetchQuota: () => quotaQuery.refetch(),
    })
  }

  async function submitClaim(index: number) {
    setClaimingIndex(index)
    return submitTurbineClaim({
      account,
      wallet,
      core: { setSubmitError, runSubmit },
      index,
      refetchSilences: () => silencesQuery.refetch(),
    })
  }

  return {
    segment,
    setSegment,
    pair: {
      unlock: { icon: dappAssets.tokenGagx, symbol: 'gAGX', decimals: GAGX_DECIMALS },
      pay: { icon: dappAssets.tokenUsd1, symbol: 'USD1', decimals: USD1_DECIMALS },
      buy: { icon: dappAssets.tokenAgx, symbol: 'AGX', decimals: AGX_DECIMALS },
    },
    unlockAmount,
    unlockAmountDisplay: unlockAmount,
    setUnlockAmount,
    fillPercent,
    payUsd1Label,
    buyAgxLabel,
    quotaLabel: formatTokenAmount(quota, AGX_DECIMALS, 4),
    usd1BalanceLabel: formatTokenAmount(usd1Balance, USD1_DECIMALS, 4),
    cooldownHoursLabel,
    unlockRatioLabel: '1:1',
    providerAddress: BSC_CONTRACTS.pancakeRouter,
    silences: silencesQuery.data?.rows ?? [],
    overview: {
      pendingUnlockLabel: formatTokenAmount(quota, AGX_DECIMALS, 2),
      coolingLabel: formatTokenAmount(coolingBalance, AGX_DECIMALS, 2),
      claimableLabel: formatTokenAmount(claimableBalance, AGX_DECIMALS, 2),
      isLoading: walletReady && (quotaQuery.isLoading || silencesQuery.isLoading),
    },
    hasClaimable: (silencesQuery.data?.claimableCount ?? 0) > 0,
    walletReady,
    canUnlock,
    isQuoting: quoteQuery.isFetching,
    isBalancesLoading,
    isSubmitting,
    claimingIndex,
    error: submitError,
    submitUnlock,
    submitClaim,
  }
}
