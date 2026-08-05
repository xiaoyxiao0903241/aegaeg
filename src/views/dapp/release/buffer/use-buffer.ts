import { useState } from 'react'
import { toast } from 'sonner'

import { useAppShell } from '~/app/use-app-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseBufferClaim } from '~/views/dapp/release/submit-release'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 缓冲池交互面板状态
 *
 * 读取链上缓冲快照，组合「可提取」门闸与进度文案；
 * 提取成功后提示并重读快照，刷新仅重拉 AGX 卡。
 */
export function useBuffer() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useAppShell()
  const { writeReady } = useWriteReadiness()
  const priceUsd = useAgxPriceUsd()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const [refreshing, setRefreshing] = useState(false)

  const claim = useChainMutation({
    path: WRITE_PATH.RELEASE_CLAIM,
    mutation: (_vars, session) => submitReleaseBufferClaim({ session }),
    onSuccess: async () => {
      toast.success(t.release.buffer.claimSuccess)
      await bufferQuery.refetch()
    },
  })

  const claimable = bufferQuery.data?.totalClaimable ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const canClaim = canClaimWhen({
    walletReady,
    writeReady,
    unknownReceiptLocked: claim.isLocked,
    claimable,
  })
  const pctLabel = formatReleasePct(claimable, releasing)

  async function onClaim() {
    if (!canClaim) return
    await claim.mutate()
  }

  async function onRefresh() {
    if (refreshing) return
    setRefreshing(true)
    try {
      // 只重读 AGX 卡链上快照；右侧 API 与 gAGX（无源）不动
      await bufferQuery.refetch()
    } finally {
      setRefreshing(false)
    }
  }

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    claimableLabel: `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} AGX`,
    releasingLabel: `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} AGX`,
    releasedPctLabel: t.release.labels.releasedPct.replace('{pct}', pctLabel.replace('%', '')),
    valueHint: formatApproxUsd(formatTokenAmountToNumber(claimable, AGX_DECIMALS), priceUsd),
    progressWidth: pctLabel,
    canClaim,
    pending: claim.isPending,
    onClaim,
    onRefresh,
    refreshing,
  }
}
