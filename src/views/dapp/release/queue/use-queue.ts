import { useState } from 'react'
import { toast } from 'sonner'

import { RELEASE_DURATION_DAYS } from '~/core/assets/claim-plans'
import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatUsdApprox } from '~/shared/presenters/format'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { formatReleasePct } from '~/views/dapp/release/shared'
import { submitReleaseQueueClaim } from '~/views/dapp/release/submit-release'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { WRITE_PATH } from '~/web3/wallet/write-path'

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
 * 领取成功后提示并重读快照，刷新重读整条队列快照。
 *
 * @see docs/onchain-manual/contracts/rewardqueue.md
 */
export function useQueue() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappHost()
  const { writeReady } = useWriteReadiness()
  const migration = useMigrationUser({ enabled: walletReady })
  const migrationOk = migration.isOldAccount === false
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

  const pending = claim.isPending

  const planSource =
    queueQuery.data?.plans.filter((p) => p.durationDays != null && p.planIndex >= 0) ?? []
  const rowPlans =
    planSource.length > 0
      ? planSource
      : RELEASE_DURATION_DAYS.map((days) => ({
          planIndex: -1,
          durationDays: days as number | null,
          claimable: ZERO_BI,
          total: ZERO_BI,
          releasing: ZERO_BI,
        }))

  const rows: ReleaseQueueRowView[] = rowPlans.map((found) => {
    const days = found.durationDays ?? 0
    const claimable = found.claimable ?? ZERO_BI
    const releasing = found.releasing ?? ZERO_BI
    const planIndex = found.planIndex ?? -1
    const pctLabel = formatReleasePct(claimable, releasing)

    return {
      days,
      planIndex,
      planLabel: interpolate(t.release.queue.planDays, { days }),
      canClaim:
        migrationOk &&
        canClaimWhen({
          walletReady,
          writeReady,
          isPending: pending,
          claimable,
          planIndexOk: planIndex >= 0,
        }),
      pending: pendingPlan === planIndex,
      claimableLabel: `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} ${t.release.units.queue}`,
      releasingLabel: `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} ${t.release.units.queue}`,
      releasedPctLabel: interpolate(t.release.labels.releasedPct, {
        pct: pctLabel.replace('%', ''),
      }),
      valueHint: formatUsdApprox(formatTokenAmountToNumber(claimable, AGX_DECIMALS), priceUsd),
      progressWidth: pctLabel,
    }
  })

  async function onClaim(planIndex: number) {
    if (!writeReady || planIndex < 0) return
    if (pending) return
    setPendingPlan(planIndex)
    try {
      await claim.mutate(planIndex)
    } catch (error) {
      setPendingPlan(null)
      throw error
    }
    setPendingPlan(null)
  }

  async function onRefresh(days: number) {
    if (refreshingDays != null) return
    setRefreshingDays(days)
    try {
      await queueQuery.refetch()
    } catch (error) {
      setRefreshingDays(null)
      throw error
    }
    setRefreshingDays(null)
  }

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    blockHint: !walletReady
      ? null
      : migration.isOldAccount === true
        ? t.staking.blocked.accountMigrated
        : migration.statusKnown && !writeReady
          ? t.topbar.wrongNetworkTooltip
          : null,
    rows,
    onClaim,
    onRefresh,
    refreshingDays,
  }
}
