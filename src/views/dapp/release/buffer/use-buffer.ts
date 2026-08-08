import { useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useDappHost } from '~/hooks/use-dapp-host'
import { usePrincipalReleaseDurationDays } from '~/hooks/use-principal-release-duration-days'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatUsdApprox } from '~/shared/presenters/format'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { formatReleasePct } from '~/views/dapp/release/shared'
import { submitReleaseBufferClaim } from '~/views/dapp/release/submit-release'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/**
 * 缓冲池交互面板状态
 *
 * 读取分流器 + 归档 PRV 快照；AGX / gAGX 分卡；领取写两边有可领的源。
 */
export function useBuffer() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappHost()
  const { writeReady } = useWriteReadiness()
  const priceUsd = useAgxPriceUsd()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const durationQuery = usePrincipalReleaseDurationDays()
  const [refreshing, setRefreshing] = useState(false)

  const claim = useChainMutation({
    path: WRITE_PATH.RELEASE_CLAIM,
    mutation: (_vars, session) => submitReleaseBufferClaim({ session }),
    onSuccess: async () => {
      toast.success(t.release.buffer.claimSuccess)
      await bufferQuery.refetch()
    },
  })

  const agxClaimable = bufferQuery.data?.agx.totalClaimable ?? ZERO_BI
  const agxReleasing = bufferQuery.data?.agx.totalReleasing ?? ZERO_BI
  const gagxClaimable = bufferQuery.data?.gagx.totalClaimable ?? ZERO_BI
  const gagxReleasing = bufferQuery.data?.gagx.totalReleasing ?? ZERO_BI
  const claimable = bufferQuery.data?.totalClaimable ?? ZERO_BI
  const canClaim = canClaimWhen({
    walletReady,
    writeReady,
    unknownReceiptLocked: claim.isLocked,
    claimable,
  })
  const agxPctLabel = formatReleasePct(agxClaimable, agxReleasing)
  const gagxPctLabel = formatReleasePct(gagxClaimable, gagxReleasing)

  async function onClaim() {
    if (!canClaim) return
    await claim.mutate()
  }

  async function onRefresh() {
    if (refreshing) return
    setRefreshing(true)
    try {
      await bufferQuery.refetch()
    } catch (error) {
      setRefreshing(false)
      throw error
    }
    setRefreshing(false)
  }

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    intro: interpolate(t.release.buffer.intro, { days: durationQuery.data ?? 30 }),
    claimableLabel: `${formatTokenAmount(agxClaimable, AGX_DECIMALS, 4)} AGX`,
    releasingLabel: `${formatTokenAmount(agxReleasing, AGX_DECIMALS, 4)} AGX`,
    releasedPctLabel: interpolate(t.release.labels.releasedPct, {
      pct: agxPctLabel.replace('%', ''),
    }),
    valueHint: formatUsdApprox(formatTokenAmountToNumber(agxClaimable, AGX_DECIMALS), priceUsd),
    progressWidth: agxPctLabel,
    gagxClaimableLabel: `${formatTokenAmount(gagxClaimable, GAGX_DECIMALS, 4)} gAGX`,
    gagxReleasingLabel: `${formatTokenAmount(gagxReleasing, GAGX_DECIMALS, 4)} gAGX`,
    gagxReleasedPctLabel: interpolate(t.release.labels.releasedPct, {
      pct: gagxPctLabel.replace('%', ''),
    }),
    gagxValueHint: formatUsdApprox(
      formatTokenAmountToNumber(gagxClaimable, GAGX_DECIMALS),
      priceUsd,
    ),
    gagxProgressWidth: gagxPctLabel,
    canClaim,
    pending: claim.isPending,
    onClaim,
    onRefresh,
    refreshing,
  }
}
