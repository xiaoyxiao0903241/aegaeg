import { useState } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
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
import { useChainQuery } from '~/hooks/use-chain-query'
import { useTurbineSummary } from '~/hooks/use-api-data'
import { useExchangeWriteMutation } from '~/views/dapp/exchange/use-exchange-write-mutation'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export type TurbineSegment = 'unlock' | 'claim'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
/** One whole AGX in base units — unit spot via handbook `quoteUsdInForAgxOut`. */
const ONE_AGX = 10n ** BigInt(AGX_DECIMALS)

/** Overview USD hint: missing unit quote → `$0.00` (empty-state SSOT). */
function formatAgxQuotaUsd(amountAgx: bigint, unitUsdPerAgx: bigint | undefined): string {
  if (unitUsdPerAgx === undefined || unitUsdPerAgx === 0n || amountAgx === 0n) {
    return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  }
  const usdNumber = formatTokenAmountToNumber((amountAgx * unitUsdPerAgx) / ONE_AGX, USD1_DECIMALS)
  if (!Number.isFinite(usdNumber) || usdNumber <= 0) {
    return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  }
  return formatGroupedNumber(usdNumber, { digits: 2, prefix: '$' })
}

/** Backend SUM amount: decimal string → grouped; integer wei-like → token format. */
function formatTurbineClaimedTotal(raw: string): string {
  if (raw.includes('.')) {
    const n = Number(raw)
    return Number.isFinite(n)
      ? formatGroupedNumber(n, { digits: 2 })
      : formatGroupedNumber(0, { digits: 2 })
  }
  try {
    return formatTokenAmount(BigInt(raw), AGX_DECIMALS, { digits: 2, trimZeros: false })
  } catch {
    const n = Number(raw)
    return Number.isFinite(n)
      ? formatGroupedNumber(n, { digits: 2 })
      : formatGroupedNumber(0, { digits: 2 })
  }
}

/** Turbine unlock (USD1→AGX cooldown) + claim cooled gAGX — handbook §16. */
export function useTurbineExchangeWidget(
  sessionReady: boolean,
  quotesEnabled = true,
  readsEnabled = quotesEnabled,
) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const walletReady = hasWalletAccount(account)

  const [segment, setSegment] = useState<TurbineSegment>('unlock')
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)

  const quotaQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineQuota,
    queryFn: (addr) => readTurbineQuota(addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const balancesQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsd1Balances,
    queryFn: (addr) => readTurbineUsd1Balances(addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const silencesQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineSilences,
    queryFn: (addr) => readTurbineSilences(addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const cooldownQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineCooldown,
    queryFn: () => readTurbineCooldownDuration(),
    scope: 'public',
    freshness: 'quote',
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const quota = quotaQuery.data ?? 0n
  const usd1Balance = balancesQuery.data?.usd1 ?? 0n
  // 决策面：钱包切换 placeholder 不算已加载。
  const balancesLoaded =
    isDecisionFresh(balancesQuery.isPlaceholderData, balancesQuery.data) &&
    isDecisionFresh(quotaQuery.isPlaceholderData, quotaQuery.data)
  const decisionQuota = balancesLoaded ? quota : 0n
  const decisionUsd1 = balancesLoaded ? usd1Balance : 0n
  const isBalancesLoading =
    walletReady && (!balancesLoaded || balancesQuery.isLoading || quotaQuery.isLoading)

  const {
    amount: unlockAmount,
    amountIn: unlockAmountIn,
    setAmount: setUnlockAmountRaw,
    clearAmount: clearAmountRaw,
    fillPercent: fillPercentRaw,
  } = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance: decisionQuota,
    balancesLoaded,
    sessionReady,
  })

  const { chainWrite, submitOutcomeRef, isSubmitting, blockResubmit } =
    useExchangeWriteMutation(clearAmountRaw)

  function clearLock() {
    chainWrite.clearLock()
  }

  function setUnlockAmount(value: string) {
    clearLock()
    setUnlockAmountRaw(value)
  }

  function fillPercent(percent: number) {
    clearLock()
    fillPercentRaw(percent)
  }

  const quoteQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(unlockAmountIn.toString()),
    queryFn: () => readTurbineUsdQuote(unlockAmountIn),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady && unlockAmountIn > 0n,
  })

  // Unit spot for meta「AGX 价格」— handbook quoteUsdInForAgxOut(1 AGX); fail → honest —.
  const unitPriceQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(ONE_AGX.toString()),
    queryFn: () => readTurbineUsdQuote(ONE_AGX),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady,
  })

  const turbineSummaryQuery = useTurbineSummary(sessionReady)

  const usdNeeded = quoteQuery.data ?? 0n
  const buyAgxLabel =
    unlockAmountIn > 0n ? formatTokenAmount(unlockAmountIn, AGX_DECIMALS, 4) : '0.00'
  // Handbook §16: USD1 needed = quoteUsdInForAgxOut(agxAmount) — never fake 1:1 / mid-quote 0.00.
  const payUsd1Label =
    unlockAmountIn <= 0n
      ? '0.00'
      : quoteQuery.isError
        ? '0'
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

  const claimedRaw = turbineSummaryQuery.data?.claimed_total
  const totalWithdrawnLabel = !sessionReady
    ? '0'
    : turbineSummaryQuery.isLoading && claimedRaw == null
      ? '0'
      : claimedRaw != null
        ? formatTurbineClaimedTotal(claimedRaw)
        : '0'
  const claimedAsNumber = claimedRaw != null ? Number(claimedRaw) : Number.NaN
  const totalWithdrawnUsdHint =
    Number.isFinite(claimedAsNumber) && claimedAsNumber === 0
      ? formatGroupedNumber(0, { digits: 2, prefix: '$' })
      : ''

  const canUnlock =
    sessionReady &&
    walletReady &&
    writeReady &&
    balancesLoaded &&
    !isSubmitting &&
    !blockResubmit &&
    unlockAmountIn > 0n &&
    unlockAmountIn <= decisionQuota &&
    usdNeeded > 0n &&
    usdNeeded <= decisionUsd1 &&
    !quoteQuery.isFetching

  async function runSubmit(run: (session: WriteSession) => Promise<void>) {
    submitOutcomeRef.current = { ok: false, error: null }
    await chainWrite.mutate(async (session) => {
      await run(session)
    })
    setClaimingIndex(null)
    return submitOutcomeRef.current
  }

  async function submitUnlock() {
    return submitTurbineUnlock({
      core: { runSubmit },
      unlockAmountAgx: unlockAmountIn,
    })
  }

  async function submitClaim(index: number) {
    setClaimingIndex(index)
    return submitTurbineClaim({
      core: { runSubmit },
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
    quotaLabel:
      quotaQuery.data === undefined
        ? ''
        : formatTokenAmount(quota, AGX_DECIMALS, { digits: 2, trimZeros: false }),
    usd1BalanceLabel:
      balancesQuery.data === undefined
        ? ''
        : formatTokenAmount(usd1Balance, USD1_DECIMALS, {
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
      pendingUnlockLabel:
        quotaQuery.data === undefined
          ? ''
          : formatTokenAmount(quota, AGX_DECIMALS, { digits: 2, trimZeros: false }),
      pendingUnlockUsdHint:
        quotaQuery.data === undefined || !unitUsdReady ? '' : formatAgxQuotaUsd(quota, unitUsd),
      coolingLabel:
        silencesQuery.data === undefined
          ? ''
          : formatTokenAmount(coolingBalance, AGX_DECIMALS, {
              digits: 2,
              trimZeros: false,
            }),
      coolingUsdHint:
        silencesQuery.data === undefined || !unitUsdReady
          ? ''
          : formatAgxQuotaUsd(coolingBalance, unitUsd),
      totalWithdrawnLabel,
      totalWithdrawnUsdHint,
      isLoading:
        walletReady &&
        (quotaQuery.isLoading || silencesQuery.isLoading || turbineSummaryQuery.isLoading),
    },
    hasClaimable: (silencesQuery.data?.claimableCount ?? 0) > 0,
    walletReady,
    canUnlock,
    isQuoting: quoteQuery.isFetching,
    isBalancesLoading,
    isSubmitting,
    claimingIndex,
    submitUnlock,
    submitClaim,
  }
}
