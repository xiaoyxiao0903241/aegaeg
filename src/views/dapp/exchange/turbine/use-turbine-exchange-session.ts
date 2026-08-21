import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'

import { TEN_BI, ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { previewTurbineExpectedAgx } from '~/core/exchange/turbine-expected-agx'
import { sumTurbineSilenceBuckets } from '~/core/exchange/turbine-silence-buckets'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { useTurbineSummary } from '~/hooks/use-api-data'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { dappAssets, tokenCarouselIcons } from '~/shared/assets/dapp'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber } from '~/shared/presenters/format'
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
  readTurbineSwapSlippageBP,
  readTurbineUsd1Balances,
  readTurbineUsdQuote,
} from '~/web3/exchange/turbine-exchange-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

export type TurbineSegment = 'unlock' | 'claim'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
/** 1 个完整 AGX 的最小单位；单位行情通过合约 quoteUsdInForAgxOut 获取。 */
const ONE_AGX = TEN_BI ** BigInt(AGX_DECIMALS)

/**
 * 概览 USD 提示：缺少单位报价时显示 `$0.00`（空态统一值）
 */
function formatAgxQuotaUsd(amountAgx: bigint, unitUsdPerAgx: bigint | undefined): string {
  if (unitUsdPerAgx === undefined || unitUsdPerAgx === ZERO_BI || amountAgx === ZERO_BI) {
    return formatNumber(0, { digits: 2, prefix: '$' })
  }
  const usdNumber = formatTokenAmountToNumber((amountAgx * unitUsdPerAgx) / ONE_AGX, USD1_DECIMALS)
  if (!Number.isFinite(usdNumber) || usdNumber <= 0) {
    return formatNumber(0, { digits: 2, prefix: '$' })
  }
  return formatNumber(usdNumber, { digits: 2, prefix: '$' })
}

/** OpenAPI 的 turbine summary/logs 金额为小数字符串（勿当作 wei）。 */
function formatTurbineSummaryAmount(raw: string | null | undefined): string {
  const n = raw == null || raw.trim() === '' ? Number.NaN : Number(raw)
  return formatNumber(Number.isFinite(n) ? n : 0, { digits: 2 })
}

/**
 * Turbine 会话状态：解锁（USD1 → AGX 进入冷却）+ 领取冷却完成的 gAGX
 *
 * 配额、余额、静默期与冷却时长均来自链上；概览金额按合约单位换算。
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export function useTurbineExchangeSession(
  sessionReady: boolean,
  quotesEnabled = true,
  readsEnabled = quotesEnabled,
) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const walletReady = hasWalletAccount(account)

  const [segment, setSegmentState] = useState<TurbineSegment>('unlock')
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

  // 概览「AGX 价格」用 1 AGX 的单位报价；读取失败时显示 —
  const unitPriceQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineUsdQuote(ONE_AGX.toString()),
    queryFn: () => readTurbineUsdQuote(ONE_AGX),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady,
  })

  // 滑点由合约 swapSlippageBP 固定（owner 配置），此处只读展示
  const slippageQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineSwapSlippage,
    queryFn: () => readTurbineSwapSlippageBP(),
    scope: 'public',
    freshness: 'static',
    enabled: quotesEnabled && sessionReady,
  })

  const turbineSummaryQuery = useTurbineSummary(sessionReady)

  const usdNeeded = quoteQuery.data ?? ZERO_BI
  // 预览实得 = min(输入按 swapSlippageBP 折减, 配额)；滑点未加载时不夸大展示
  const buyAgxLabel =
    unlockAmountIn > ZERO_BI && slippageQuery.data !== undefined
      ? formatTokenAmount(
          previewTurbineExpectedAgx({
            unlockAmountIn,
            swapSlippageBP: slippageQuery.data,
            quota: decisionQuota,
          }),
          AGX_DECIMALS,
          4,
        )
      : formatNumber(0, { digits: 4 })
  // 所需 USD1 = 合约 quoteUsdInForAgxOut(agxAmount)，不伪造 1:1 或中间价
  const payUsd1Label =
    unlockAmountIn <= ZERO_BI
      ? formatNumber(0, { digits: 4 })
      : quoteQuery.isError
        ? formatNumber(0, { digits: 4 })
        : quoteQuery.data === undefined
          ? formatNumber(0, { digits: 4 })
          : formatTokenAmount(quoteQuery.data, USD1_DECIMALS, 4)

  const unitUsd = unitPriceQuery.data
  const unitUsdNumber =
    unitUsd === undefined ? 0 : formatTokenAmountToNumber(unitUsd, USD1_DECIMALS)
  const agxPriceLabel =
    unitPriceQuery.isError || unitUsd === undefined || unitUsdNumber <= 0
      ? ''
      : formatNumber(unitUsdNumber, { digits: 2, prefix: '$' })

  // BPS 转百分数：300 → 3%；30 → 0.3%（按位数精确转换，不硬编码示例值）
  const slippageLabel = (() => {
    if (slippageQuery.isError) return '—'
    if (slippageQuery.data === undefined) return ''
    const bps = Number(slippageQuery.data)
    if (!Number.isFinite(bps) || bps < 0) return '—'
    const pct = bps / 100
    const text = Number.isInteger(pct) ? String(pct) : String(Number(pct.toFixed(4)))
    return `${text}%`
  })()

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
  const totalWithdrawnLabel = !sessionReady
    ? formatTurbineSummaryAmount(null)
    : turbineSummaryQuery.isLoading && claimedRaw == null
      ? formatTurbineSummaryAmount(null)
      : formatTurbineSummaryAmount(claimedRaw)
  const claimedAsNumber = claimedRaw != null ? Number(claimedRaw) : Number.NaN
  const totalWithdrawnUsdHint = (() => {
    if (!Number.isFinite(claimedAsNumber)) return ''
    if (claimedAsNumber === 0) return formatNumber(0, { digits: 2, prefix: '$' })
    if (!unitUsdReady) return ''
    return formatNumber(claimedAsNumber * unitUsdNumber, { digits: 2, prefix: '$' })
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
    // 冷启动无价才 busy；后台 refetch 保留上一笔 usdNeeded，勿闪灰。
    !quoteQuery.isPending

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
    quotaLabel:
      quotaQuery.data === undefined
        ? formatNumber(0, { digits: 2 })
        : formatTokenAmount(quota, AGX_DECIMALS, { digits: 2, trimZeros: false }),
    usd1BalanceLabel:
      balancesQuery.data === undefined
        ? formatNumber(0, { digits: 2 })
        : formatTokenAmount(usd1Balance, USD1_DECIMALS, {
            digits: 2,
            trimZeros: false,
          }),
    cooldownHours,
    agxPriceLabel,
    slippageLabel,
    isAgxPriceQuoting: sessionReady && unitPriceQuery.isFetching && !agxPriceLabel,
    isSlippageLoading: sessionReady && slippageQuery.isFetching && !slippageLabel,
    providerAddress: BSC_CONTRACTS.turbine,
    silences: silencesQuery.data?.rows ?? [],
    isSilencesLoading: walletReady && silencesQuery.isLoading,
    overview: {
      pendingUnlockLabel:
        quotaQuery.data === undefined
          ? formatNumber(0, { digits: 2 })
          : formatTokenAmount(quota, AGX_DECIMALS, { digits: 2, trimZeros: false }),
      pendingUnlockUsdHint:
        quotaQuery.data === undefined || !unitUsdReady
          ? formatNumber(0, { digits: 2, prefix: '≈ $' })
          : formatAgxQuotaUsd(quota, unitUsd),
      coolingLabel:
        silencesQuery.data === undefined
          ? formatNumber(0, { digits: 2 })
          : formatTokenAmount(coolingBalance, AGX_DECIMALS, {
              digits: 2,
              trimZeros: false,
            }),
      coolingUsdHint:
        silencesQuery.data === undefined || !unitUsdReady
          ? formatNumber(0, { digits: 2, prefix: '≈ $' })
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
    // quoteQuery 无 keepPreviousData；冷启动用 isPending，勿用 isFetching。
    isQuoting: unlockAmountIn > ZERO_BI && quoteQuery.isPending,
    isBalancesLoading,
    isSubmitting,
    claimingIndex,
    submitUnlock,
    submitClaim,
  }
}
