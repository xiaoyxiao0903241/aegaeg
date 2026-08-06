import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolSummary, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber, parseApiAmount } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatReleaseApiOrChainLabel, formatReleasePct } from '~/views/dapp/release/shared'
import {
  useReleaseBufferSnapshot,
  useReleaseQueueSnapshot,
} from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 释放总览交互面板状态
 *
 * 组合队列与缓冲池的 API / 链上标签与进度百分比。
 */
export function useHub() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
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
    apiRaw: releaseApi.data?.released_amount,
    chainReady,
    chainValue: queueClaimable,
    decimals: AGX_DECIMALS,
    unit: queueUnit,
  })

  const bufferTotalChain = bufferClaimable + bufferReleasing
  const bufferTotalAgx = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: bufferApi.data?.cumulative_amount,
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
  const gagxZeroLabel = `${formatGroupedNumber(0, { digits: 4 })} ${t.release.units.queue}`

  const queueReleasingNum = chainReady
    ? formatTokenAmountToNumber(queueReleasing, AGX_DECIMALS)
    : (parseApiAmount(releaseApi.data?.releasing_amount) ?? 0)
  const queueClaimableNum = chainReady
    ? formatTokenAmountToNumber(queueClaimable, AGX_DECIMALS)
    : (parseApiAmount(releaseApi.data?.released_amount) ?? 0)
  const bufferTotalNum = bufferChainReady
    ? formatTokenAmountToNumber(bufferTotalChain, AGX_DECIMALS)
    : (parseApiAmount(bufferApi.data?.cumulative_amount) ?? 0)

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
    queueReleasingApprox: formatApproxUsd(queueReleasingNum, priceUsd),
    queueClaimableApprox: formatApproxUsd(queueClaimableNum, priceUsd),
    bufferTotalApprox: formatApproxUsd(bufferTotalNum, priceUsd),
    bufferGagxApprox: formatApproxUsd(0, null),
  }
}
