import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatGroupedNumber } from '~/shared/api/format-display'
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
import { formatExchangeRateColon } from '~/views/dapp/exchange/exchange-format-rate'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
} from '~/web3/wallet/unknown-receipt-lock'

export type TurbineSegment = 'unlock' | 'claim'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
/** One whole AGX in base units — unit spot via handbook `quoteUsdInForAgxOut`. */
const ONE_AGX = 10n ** BigInt(AGX_DECIMALS)

/** Overview USD hint: zero amount → `$0.00`; missing/failed unit quote → empty (never fake `$0.00`). */
function formatAgxQuotaUsd(amountAgx: bigint, unitUsdPerAgx: bigint | undefined): string {
  if (amountAgx === 0n) return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  if (unitUsdPerAgx === undefined || unitUsdPerAgx === 0n) return ''
  const usdNumber = formatTokenAmountToNumber((amountAgx * unitUsdPerAgx) / ONE_AGX, USD1_DECIMALS)
  if (!Number.isFinite(usdNumber) || usdNumber <= 0) return ''
  return formatGroupedNumber(usdNumber, { digits: 2, prefix: '$' })
}

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
    setAmount: setUnlockAmountRaw,
    clearAmount: clearAmountRaw,
    fillPercent: fillPercentRaw,
  } = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance: quota,
    balancesLoaded,
    sessionReady,
    onBeforeCap: () => setSubmitError(null),
  })

  function setUnlockAmount(value: string) {
    clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
    setBlockResubmit(false)
    setUnlockAmountRaw(value)
  }

  function clearAmount() {
    clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
    setBlockResubmit(false)
    clearAmountRaw()
  }

  function fillPercent(percent: number) {
    clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
    setBlockResubmit(false)
    fillPercentRaw(percent)
  }

  const quoteQuery = useQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(unlockAmountIn.toString()),
    queryFn: () => readTurbineUsdQuote(unlockAmountIn, readClient),
    enabled: quotesEnabled && sessionReady && unlockAmountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
  })

  // Unit spot for meta「AGX 价格」— handbook quoteUsdInForAgxOut(1 AGX); fail → honest —.
  const unitPriceQuery = useQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(ONE_AGX.toString()),
    queryFn: () => readTurbineUsdQuote(ONE_AGX, readClient),
    enabled: quotesEnabled && sessionReady,
    staleTime: QUERY_STALE_TIME.quote,
  })

  const usdNeeded = quoteQuery.data ?? 0n
  const buyAgxLabel =
    unlockAmountIn > 0n ? formatTokenAmount(unlockAmountIn, AGX_DECIMALS, 4) : '0.00'
  // Handbook §16: USD1 needed = quoteUsdInForAgxOut(agxAmount) — never fake 1:1 / mid-quote 0.00.
  const payUsd1Label =
    unlockAmountIn <= 0n
      ? '0.00'
      : quoteQuery.isError
        ? '—'
        : quoteQuery.data === undefined
          ? ''
          : formatTokenAmount(quoteQuery.data, USD1_DECIMALS, 4)

  const unitUsd = unitPriceQuery.data
  const unitUsdNumber =
    unitUsd === undefined ? 0 : formatTokenAmountToNumber(unitUsd, USD1_DECIMALS)
  const agxPriceLabel =
    unitPriceQuery.isError || unitUsd === undefined || unitUsdNumber <= 0
      ? ''
      : formatGroupedNumber(unitUsdNumber, { digits: 2, prefix: '$' })

  // Meta「解锁比率」— live colon from quoteUsdInForAgxOut(1 AGX); empty → honest —.
  const unlockRatioLabel =
    unitPriceQuery.isError || unitUsd === undefined || unitUsd === 0n
      ? ''
      : formatExchangeRateColon({
          amountIn: ONE_AGX,
          amountOut: unitUsd,
          decimalsIn: AGX_DECIMALS,
          decimalsOut: USD1_DECIMALS,
        })

  const cooldownSeconds = Number(cooldownQuery.data ?? silencesQuery.data?.cooldownDuration ?? 0n)
  const cooldownHours = cooldownSeconds > 0 ? Math.round(cooldownSeconds / 3600) : null

  const coolingBalance =
    silencesQuery.data?.rows.reduce(
      (sum, row) => (row.vested ? sum : sum + row.silenceBalance),
      0n,
    ) ?? 0n

  const unitUsdReady = unitUsd !== undefined && unitUsd > 0n && !unitPriceQuery.isError

  const canUnlock =
    sessionReady &&
    walletReady &&
    writeReady &&
    !isSubmitting &&
    !blockResubmit &&
    !isUnknownReceiptLocked(WRITE_PATH.EXCHANGE) &&
    unlockAmountIn > 0n &&
    unlockAmountIn <= quota &&
    usdNeeded > 0n &&
    usdNeeded <= usd1Balance &&
    !quoteQuery.isFetching

  async function runSubmit(run: () => Promise<void>) {
    setIsSubmitting(true)
    setSubmitError(null)
    const guarded = await submitWithUnknownReceiptLock({
      path: WRITE_PATH.EXCHANGE,
      whenLocked: new Error('UNKNOWN_RECEIPT_LOCKED'),
      run,
    })
    setIsSubmitting(false)
    setClaimingIndex(null)

    if (!guarded.ok) {
      if (
        isUnknownSubmitOutcome(guarded.error) ||
        (guarded.error instanceof Error && guarded.error.message === 'UNKNOWN_RECEIPT_LOCKED')
      ) {
        setBlockResubmit(true)
      }
      setSubmitError(guarded.error)
      return { ok: false as const, error: guarded.error }
    }

    clearAmount()
    return { ok: true as const }
  }

  async function submitUnlock() {
    return submitTurbineUnlock({
      account,
      wallet,
      core: { setSubmitError, runSubmit },
      unlockAmountAgx: unlockAmountIn,
      refetchBalances: () => balancesQuery.refetch(),
      refetchQuota: () => quotaQuery.refetch(),
      refetchUsdQuote: () => quoteQuery.refetch(),
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
      // Handbook §16: turbineBalances amount axis = AGX decimals. Figma unlock leaf labels gAGX.
      unlock: { icon: dappAssets.tokenGagx, symbol: 'gAGX', decimals: AGX_DECIMALS },
      pay: { icon: dappAssets.tokenUsd1, symbol: 'USD1', decimals: USD1_DECIMALS },
      buy: { icon: dappAssets.tokenAgx, symbol: 'AGX', decimals: AGX_DECIMALS },
    },
    unlockAmount,
    unlockAmountDisplay: unlockAmount,
    setUnlockAmount,
    fillPercent,
    payUsd1Label,
    buyAgxLabel,
    quotaLabel: formatTokenAmount(quota, AGX_DECIMALS, { digits: 2, trimZeros: false }),
    usd1BalanceLabel: formatTokenAmount(usd1Balance, USD1_DECIMALS, {
      digits: 2,
      trimZeros: false,
    }),
    cooldownHours,
    unlockRatioLabel,
    agxPriceLabel,
    isAgxPriceQuoting: sessionReady && unitPriceQuery.isFetching && !agxPriceLabel,
    isUnlockRatioQuoting: sessionReady && unitPriceQuery.isFetching && !unlockRatioLabel,
    providerAddress: BSC_CONTRACTS.turbine,
    silences: silencesQuery.data?.rows ?? [],
    isSilencesLoading: walletReady && silencesQuery.isLoading,
    overview: {
      pendingUnlockLabel: formatTokenAmount(quota, AGX_DECIMALS, { digits: 2, trimZeros: false }),
      pendingUnlockUsdHint: formatAgxQuotaUsd(quota, unitUsdReady ? unitUsd : undefined),
      coolingLabel: formatTokenAmount(coolingBalance, AGX_DECIMALS, {
        digits: 2,
        trimZeros: false,
      }),
      coolingUsdHint: formatAgxQuotaUsd(coolingBalance, unitUsdReady ? unitUsd : undefined),
      // No cumulative claim index on-chain yet — placeholder 0.00 until indexer.
      totalWithdrawnLabel: '0.00',
      totalWithdrawnUsdHint: formatGroupedNumber(0, { digits: 2, prefix: '$' }),
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
