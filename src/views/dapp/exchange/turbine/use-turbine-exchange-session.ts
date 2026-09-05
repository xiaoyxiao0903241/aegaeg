import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'

import { TEN_BI, ZERO_BI } from '~/core/constants'
import {
  formatTokenAmount,
  formatTokenAmountToNumber,
  PERSONAL_TOKEN_DIGITS,
  slippageDraftAfterModeChange,
  slippagePercentToBps,
} from '~/core/exchange/token-amount'
import { sumTurbineSilenceBuckets } from '~/core/exchange/turbine-silence-buckets'
import {
  calcTurbinePayableUsd,
  isTurbineQuotaCapReady,
  resolveTurbineSlippagePercent,
  TURBINE_AUTO_SLIPPAGE_PERCENT,
} from '~/core/exchange/turbine-unlock-live'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { useTurbineSummary } from '~/hooks/use-api-data'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { dappAssets, tokenCarouselIcons } from '~/shared/assets/dapp'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatDecimal, LIVE_DATA_PLACEHOLDER } from '~/shared/presenters/format'
import type { ExchangeSubmitResult } from '~/views/dapp/exchange/shared'
import {
  submitTurbineClaim,
  submitTurbineUnlock,
} from '~/views/dapp/exchange/turbine/submit-turbine-exchange'
import { useExchangeWriteMutation } from '~/views/dapp/exchange/use-exchange-write-mutation'
import {
  readTurbineCooldownDuration,
  readTurbineQuota,
  readTurbineSilences,
  readTurbineUsd1Balances,
  readTurbineUsdQuote,
} from '~/web3/exchange/turbine-exchange-read'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

export type TurbineSegment = 'unlock' | 'claim'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
/** 1 个完整 AGX 的最小单位；单位行情通过合约 quoteUsdInForAgxOut 获取。 */
const ONE_AGX = TEN_BI ** BigInt(AGX_DECIMALS)

/**
 * 概览 USD 提示：缺少单位报价时显示 `--`
 */
function formatAgxQuotaUsd(amountAgx: bigint, unitUsdPerAgx: bigint | undefined): string {
  if (unitUsdPerAgx === undefined) return LIVE_DATA_PLACEHOLDER
  if (unitUsdPerAgx === ZERO_BI || amountAgx === ZERO_BI) {
    return formatDecimal(0, { digits: 2, prefix: '≈ $' })
  }
  return formatDecimal(
    formatTokenAmountToNumber((amountAgx * unitUsdPerAgx) / ONE_AGX, USD1_DECIMALS),
    { digits: 2, prefix: '≈ $' },
  )
}

/** OpenAPI 的 turbine summary/logs 金额为小数字符串（勿当作 wei）。 */
function formatTurbineSummaryAmount(raw: string | null | undefined): string {
  return formatDecimal(raw, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' gAGX' })
}

/**
 * Turbine 会话状态：解锁（USD1 → AGX 进入冷却）+ 领取冷却完成的 gAGX
 *
 * 配额、余额、静默期与冷却时长均来自链上；应付 USD1 按报价加用户滑点，满额截到全配额报价。
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export function useTurbineExchangeSession(
  sessionReady: boolean,
  quotesEnabled = true,
  readsEnabled = quotesEnabled,
) {
  const { walletReady, writeReady } = useWriteReadiness()

  const [segment, setSegmentState] = useState<TurbineSegment>('unlock')
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)
  const [slippageMode, setSlippageModeState] = useState<'auto' | 'custom'>('auto')
  const [slippageCustomText, setSlippageCustomTextState] = useState('')
  const autoSlippagePercent = TURBINE_AUTO_SLIPPAGE_PERCENT
  const slippage = resolveTurbineSlippagePercent(slippageMode, slippageCustomText)
  const slippageBps = slippagePercentToBps(slippage)

  function setSlippageMode(mode: 'auto' | 'custom') {
    setSlippageCustomTextState(
      slippageDraftAfterModeChange(mode, slippageMode, slippageCustomText, autoSlippagePercent),
    )
    setSlippageModeState(mode)
  }

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

  const quota = quotaQuery.data ?? ZERO_BI
  const usd1Balance = balancesQuery.data?.usd1 ?? ZERO_BI
  // 判断用余额：钱包切换时的旧值（keepPreviousData）不算已加载
  const balancesLoaded =
    isDecisionFresh(balancesQuery.isPlaceholderData, balancesQuery.data) &&
    isDecisionFresh(quotaQuery.isPlaceholderData, quotaQuery.data)
  const decisionQuota = balancesLoaded ? quota : ZERO_BI
  const decisionUsd1 = balancesLoaded ? usd1Balance : ZERO_BI
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

  const { chainWrite, isSubmitting } = useExchangeWriteMutation(clearAmountRaw)

  function setUnlockAmount(value: string) {
    setUnlockAmountRaw(value)
  }

  function fillPercent(percent: number) {
    fillPercentRaw(percent)
  }

  function setSegment(next: TurbineSegment) {
    setSegmentState(next)
  }

  const quoteQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(unlockAmountIn.toString()),
    queryFn: () => readTurbineUsdQuote(unlockAmountIn),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady && unlockAmountIn > ZERO_BI,
  })

  const needsQuotaCapQuote =
    unlockAmountIn > ZERO_BI && decisionQuota > ZERO_BI && unlockAmountIn !== decisionQuota
  const quotaQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(decisionQuota.toString()),
    queryFn: () => readTurbineUsdQuote(decisionQuota),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady && needsQuotaCapQuote,
  })

  // 概览「AGX 价格」用 1 AGX 的单位报价；读取失败时显示 —
  const unitPriceQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(ONE_AGX.toString()),
    queryFn: () => readTurbineUsdQuote(ONE_AGX),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady,
  })

  const turbineSummaryQuery = useTurbineSummary(sessionReady)

  const quotedUsd = quoteQuery.data ?? ZERO_BI
  const quotaCapReady = isTurbineQuotaCapReady({
    needsQuotaCapQuote,
    isPlaceholderData: quotaQuoteQuery.isPlaceholderData,
    quotedQuota: quotaQuoteQuery.data,
  })
  const quotedQuota =
    unlockAmountIn === decisionQuota ? quotedUsd : (quotaQuoteQuery.data ?? ZERO_BI)
  const usdNeeded =
    quotedUsd > ZERO_BI && quotaCapReady
      ? calcTurbinePayableUsd(quotedUsd, quotedQuota, slippageBps)
      : ZERO_BI
  const buyAgxLabel = formatTokenAmount(unlockAmountIn, AGX_DECIMALS, 4)
  // 支付 USD1 = min(quote × (1 + 滑点), 全配额报价)
  const payUsd1Label = formatTokenAmount(
    unlockAmountIn <= ZERO_BI
      ? ZERO_BI
      : quoteQuery.isError ||
          (needsQuotaCapQuote && quotaQuoteQuery.isError) ||
          quoteQuery.data === undefined ||
          !quotaCapReady
        ? null
        : usdNeeded,
    USD1_DECIMALS,
    4,
  )

  const unitUsd = unitPriceQuery.data
  const unitUsdNumber =
    unitUsd === undefined ? 0 : formatTokenAmountToNumber(unitUsd, USD1_DECIMALS)
  const agxPriceLabel =
    unitPriceQuery.isError || unitUsd === undefined || unitUsdNumber <= 0
      ? ''
      : formatDecimal(unitUsdNumber, { digits: 2, prefix: '$' })

  const cooldownSeconds = Number(
    cooldownQuery.data ?? silencesQuery.data?.cooldownDuration ?? ZERO_BI,
  )
  const cooldownHours = cooldownSeconds > 0 ? Math.round(cooldownSeconds / 3600) : null

  // 链上分态：!isVested → 冷却中；isVested → 可领取（勿并入冷却卡，也勿丢进「累计已提取」）
  const silenceBuckets = sumTurbineSilenceBuckets(silencesQuery.data?.rows ?? [])
  const coolingBalance = silenceBuckets.cooling
  const claimableBalance = silenceBuckets.claimable

  const unitUsdReady = unitUsd !== undefined && unitUsd > ZERO_BI && !unitPriceQuery.isError

  // OpenAPI `/turbine/summary` 的 claimed_total 为已领取金额（小数字符串，勿当 wei）
  const claimedRaw = turbineSummaryQuery.data?.claimed_total
  const totalWithdrawnLabel = formatTurbineSummaryAmount(claimedRaw)
  const claimedAsNumber = claimedRaw != null ? Number(claimedRaw) : Number.NaN
  const totalWithdrawnUsdHint = (() => {
    if (!Number.isFinite(claimedAsNumber)) return LIVE_DATA_PLACEHOLDER
    if (claimedAsNumber === 0) return formatDecimal(0, { digits: 2, prefix: '≈ $' })
    if (!unitUsdReady) return LIVE_DATA_PLACEHOLDER
    return formatDecimal(claimedAsNumber * unitUsdNumber, { digits: 2, prefix: '≈ $' })
  })()

  const canUnlock =
    sessionReady &&
    walletReady &&
    writeReady &&
    balancesLoaded &&
    !isSubmitting &&
    unlockAmountIn > ZERO_BI &&
    unlockAmountIn <= decisionQuota &&
    usdNeeded > ZERO_BI &&
    usdNeeded <= decisionUsd1 &&
    quotaCapReady &&
    // 冷启动无价才 busy；后台 refetch 保留上一笔 usdNeeded，勿闪灰。
    !quoteQuery.isPending &&
    (!needsQuotaCapQuote || !quotaQuoteQuery.isPending)

  async function runSubmit(
    run: (session: WriteSession) => Promise<void>,
  ): Promise<ExchangeSubmitResult> {
    const ok = await chainWrite.mutate(async (session) => {
      await run(session)
    })
    setClaimingIndex(null)
    if (ok === true) return { ok: true }
    return { ok: false }
  }

  async function submitUnlock() {
    return submitTurbineUnlock({
      core: { runSubmit },
      unlockAmountAgx: unlockAmountIn,
      slippageBps,
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
      // turbineBalances 以 AGX 小数位计量，界面解锁标签显示为 gAGX
      // 解锁侧图标与兑换中心 gAGX 入口保持一致
      unlock: { icon: tokenCarouselIcons.gagxIcon, symbol: 'gAGX', decimals: AGX_DECIMALS },
      pay: { icon: dappAssets.tokenUsd1, symbol: 'USD1', decimals: USD1_DECIMALS },
      buy: { icon: tokenCarouselIcons.agxIcon, symbol: 'AGX', decimals: AGX_DECIMALS },
    },
    unlockAmount,
    unlockAmountDisplay: unlockAmount,
    setUnlockAmount,
    fillPercent,
    payUsd1Label,
    buyAgxLabel,
    quotaLabel: formatTokenAmount(quotaQuery.data, AGX_DECIMALS, {
      digits: PERSONAL_TOKEN_DIGITS,
      trimZeros: false,
      suffix: ' gAGX',
    }),
    usd1BalanceLabel: formatTokenAmount(balancesQuery.data?.usd1, USD1_DECIMALS, {
      digits: PERSONAL_TOKEN_DIGITS,
      trimZeros: false,
    }),
    cooldownHours,
    agxPriceLabel,
    slippage,
    slippageMode,
    setSlippageMode,
    // 空草稿原样交给输入框；报价仍可用默认档，勿在此回填，否则无法删光再输入。
    slippageCustomText,
    setSlippageCustomText: setSlippageCustomTextState,
    autoSlippagePercent,
    isAgxPriceQuoting: sessionReady && unitPriceQuery.isFetching && !agxPriceLabel,
    providerAddress: BSC_CONTRACTS.turbine,
    silences: silencesQuery.data?.rows ?? [],
    isSilencesLoading: walletReady && silencesQuery.isLoading,
    overview: {
      pendingUnlockLabel: formatTokenAmount(quotaQuery.data, AGX_DECIMALS, {
        digits: PERSONAL_TOKEN_DIGITS,
        trimZeros: false,
        suffix: ' gAGX',
      }),
      pendingUnlockUsdHint:
        quotaQuery.data === undefined || !unitUsdReady
          ? LIVE_DATA_PLACEHOLDER
          : formatAgxQuotaUsd(quota, unitUsd),
      coolingLabel: formatTokenAmount(
        silencesQuery.data === undefined ? null : coolingBalance,
        AGX_DECIMALS,
        {
          digits: PERSONAL_TOKEN_DIGITS,
          trimZeros: false,
          suffix: ' gAGX',
        },
      ),
      coolingUsdHint:
        silencesQuery.data === undefined || !unitUsdReady
          ? LIVE_DATA_PLACEHOLDER
          : formatAgxQuotaUsd(coolingBalance, unitUsd),
      totalWithdrawnLabel,
      totalWithdrawnUsdHint,
      isLoading:
        walletReady &&
        (quotaQuery.isLoading || silencesQuery.isLoading || turbineSummaryQuery.isLoading),
    },
    hasClaimable: claimableBalance > ZERO_BI,
    walletReady,
    canUnlock,
    // 冷启动用 isPending，勿用 isFetching；全配额截顶未就绪时同样视为 quoting。
    isQuoting:
      unlockAmountIn > ZERO_BI && (quoteQuery.isPending || (needsQuotaCapQuote && !quotaCapReady)),
    isBalancesLoading,
    isSubmitting,
    claimingIndex,
    submitUnlock,
    submitClaim,
  }
}
