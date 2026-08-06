import { SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolSummary, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber, formatUsdApprox, parseApiAmount } from '~/shared/presenters/format-display'
import { formatReleaseApiOrChainLabel, formatReleasePct } from '~/views/dapp/release/shared'
import {
  useReleaseBufferSnapshot,
  useReleaseQueuePlans,
  useReleaseQueueSnapshot,
} from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 释放总览交互面板状态
 *
 * 组合队列与缓冲池的 API / 链上标签与进度百分比；税率表优先读 queuePlans。
 */
export function useReleaseHub() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const plansQuery = useReleaseQueuePlans()
  const releaseApi = useReleasePoolSummary(sessionReady)
  const bufferApi = useBufferPoolSummary(sessionReady)

  const queueClaimable = queueQuery.data?.totalClaimable ?? 0n
  const queueReleasing = queueQuery.data?.totalReleasing ?? 0n
  const bufferClaimable = bufferQuery.data?.totalClaimable ?? 0n
  const bufferClaimed = bufferQuery.data?.totalClaimed ?? 0n
  const bufferReleasing = bufferQuery.data?.totalReleasing ?? 0n
  const chainReady = walletReady && queueQuery.data != null
  const bufferChainReady = walletReady && bufferQuery.data != null

  const queuePct = formatReleasePct(queueClaimable, queueReleasing)
  const bufferPct = formatReleasePct(bufferClaimable, bufferReleasing)

  // API 可领 ≈ released − claimed；勿把累计 released_amount 直接塞进「可领取」
  const apiQueueClaimableRaw = (() => {
    const released = parseApiAmount(releaseApi.data?.released_amount)
    const claimed = parseApiAmount(releaseApi.data?.total_claimed_amount)
    if (released == null || claimed == null) return undefined
    return String(Math.max(0, released - claimed))
  })()

  const queueUnit = t.release.units.queue
  const queueReleasingLabel = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: releaseApi.data?.releasing_amount,
    chainReady,
    chainValue: queueReleasing,
    decimals: AGX_DECIMALS,
    unit: queueUnit,
  })
  const queueClaimableLabel = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: apiQueueClaimableRaw,
    chainReady,
    chainValue: queueClaimable,
    decimals: AGX_DECIMALS,
    unit: queueUnit,
  })

  const bufferTotalChain = bufferClaimable + bufferReleasing
  // 缓冲 Total=池内剩余：API 用 releasing_amount（cumulative−released），勿用累计入池
  const bufferTotalAgx = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: bufferApi.data?.releasing_amount,
    chainReady: bufferChainReady,
    chainValue: bufferTotalChain,
    decimals: AGX_DECIMALS,
    unit: 'AGX',
  })
  const bufferClaimedAgx = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: bufferApi.data?.released_amount,
    chainReady: bufferChainReady,
    chainValue: bufferClaimed,
    decimals: AGX_DECIMALS,
    unit: 'AGX',
  })
  const gagxZeroLabel = `${formatNumber(0, { digits: 4 })} ${t.release.units.queue}`

  const queueReleasingNum = chainReady
    ? formatTokenAmountToNumber(queueReleasing, AGX_DECIMALS)
    : (parseApiAmount(releaseApi.data?.releasing_amount) ?? 0)
  const queueClaimableNum = chainReady
    ? formatTokenAmountToNumber(queueClaimable, AGX_DECIMALS)
    : (parseApiAmount(apiQueueClaimableRaw) ?? 0)
  const bufferTotalNum = bufferChainReady
    ? formatTokenAmountToNumber(bufferTotalChain, AGX_DECIMALS)
    : (parseApiAmount(bufferApi.data?.releasing_amount) ?? 0)

  const fallbackPeriods = t.release.hub.taxRows.periods
  const fallbackRates = t.release.hub.taxRows.rates
  const taxPeriods =
    plansQuery.data != null && plansQuery.data.length > 0
      ? plansQuery.data.map((plan) => {
          const days = Number(plan.durationSeconds / SECONDS_PER_DAY)
          return `${days}d`
        })
      : fallbackPeriods
  const taxRates =
    plansQuery.data != null && plansQuery.data.length > 0
      ? plansQuery.data.map(
          (plan) => `${formatNumber(Number(plan.taxBps) / 100, { digits: 0, trimZeros: true })}%`,
        )
      : fallbackRates

  return {
    t,
    walletReady,
    queuePct,
    bufferPct,
    queueReleasingLabel,
    queueClaimableLabel,
    bufferTotalAgx,
    bufferClaimedAgx,
    gagxZeroLabel,
    queueReleasingApprox: formatUsdApprox(queueReleasingNum, priceUsd),
    queueClaimableApprox: formatUsdApprox(queueClaimableNum, priceUsd),
    bufferTotalApprox: formatUsdApprox(bufferTotalNum, priceUsd),
    bufferGagxApprox: formatUsdApprox(0, null),
    taxPeriods,
    taxRates,
  }
}
