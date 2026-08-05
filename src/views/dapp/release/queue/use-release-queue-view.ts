import { useState } from 'react'
import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { RELEASE_DURATION_DAYS } from '~/core/assets/claim-plans'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd } from '~/shared/api/format-display'
import { queryClient } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseQueueClaim } from '~/views/dapp/release/submit-release'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'
import {
  patchReleaseQueuePlan,
  readReleaseQueuePlanByDays,
  type ReleaseQueueSnapshot,
} from '~/web3/release/release-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export type ReleaseQueueRowView = {
  days: number
  planIndex: number
  planLabel: string
  canClaim: boolean
  pending: boolean
  claimableLabel: string
  releasingLabel: string
  releasedPctLabel: string
  valueHint: string
  progressWidth: string
}

/**
 * 释放队列交互面板状态
 *
 * 逐档位读取链上快照，组合领取门闸与进度文案；
 * 领取成功后提示并重读快照，刷新只重读被点档位并回填缓存。
 *
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export function useReleaseQueueView() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const priceUsd = useAgxPriceUsd()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const [pendingPlan, setPendingPlan] = useState<number | null>(null)
  const [refreshingDays, setRefreshingDays] = useState<number | null>(null)

  const claim = useChainMutation({
    path: WRITE_PATH.RELEASE_CLAIM,
    mutation: (planIndex: number, session) => submitReleaseQueueClaim({ session, planIndex }),
    onSuccess: async () => {
      toast.success(t.release.queue.claimSuccess)
      await queueQuery.refetch()
    },
  })

  const locked = claim.isLocked

  const rows: ReleaseQueueRowView[] = RELEASE_DURATION_DAYS.map((days) => {
    const found = queueQuery.data?.plans.find((p) => p.durationDays === days)
    const claimable = found?.claimable ?? 0n
    const releasing = found?.releasing ?? 0n
    const planIndex = found?.planIndex ?? -1
    const pctLabel = formatReleasePct(claimable, releasing)

    return {
      days,
      planIndex,
      planLabel: t.release.queue.planDays.replace('{days}', String(days)),
      canClaim: canClaimWhen({
        walletReady,
        writeReady,
        unknownReceiptLocked: locked,
        claimable,
        planIndexOk: planIndex >= 0,
      }),
      pending: pendingPlan === planIndex,
      claimableLabel: `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} ${t.release.units.queue}`,
      releasingLabel: `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} ${t.release.units.queue}`,
      releasedPctLabel: t.release.labels.releasedPct.replace('{pct}', pctLabel.replace('%', '')),
      valueHint: formatApproxUsd(formatTokenAmountToNumber(claimable, AGX_DECIMALS), priceUsd),
      progressWidth: pctLabel,
    }
  })

  async function onClaim(planIndex: number) {
    if (!writeReady || locked || planIndex < 0) return
    setPendingPlan(planIndex)
    try {
      await claim.mutate(planIndex)
    } finally {
      setPendingPlan(null)
    }
  }

  async function onRefresh(days: number) {
    if (refreshingDays != null) return
    const address = account?.address?.toLowerCase()
    if (!address) return
    setRefreshingDays(days)
    try {
      const hint = queueQuery.data?.plans.find((p) => p.durationDays === days)?.planIndex ?? -1
      // 只重读被点击的档位；有 planIndex 时用单次 Multicall，不读其它档
      const row = await readReleaseQueuePlanByDays(address as Address, days, hint)
      queryClient.setQueryData(
        queryKeys.chain.releaseQueueOf(address),
        (prev: ReleaseQueueSnapshot | undefined) => {
          if (prev) return patchReleaseQueuePlan(prev, row)
          return {
            plans: RELEASE_DURATION_DAYS.map((d) =>
              d === days
                ? row
                : {
                    planIndex: -1,
                    durationDays: d,
                    claimable: 0n,
                    total: 0n,
                    releasing: 0n,
                  },
            ),
            totalClaimable: row.claimable,
            totalLocked: row.total,
            totalReleasing: row.releasing,
          }
        },
      )
    } finally {
      setRefreshingDays(null)
    }
  }

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    rows,
    onClaim,
    onRefresh,
    refreshingDays,
  }
}
