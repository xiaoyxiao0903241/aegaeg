import { useState } from 'react'
import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { RELEASE_DURATION_DAYS } from '~/core/assets/claim-plans'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useI18n } from '~/i18n/use-i18n'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseQueueClaim } from '~/views/dapp/release/submit-release'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'
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

/** Release queue reads + per-plan pending state + claim toast → everything `ReleaseQueueWidget` renders. */
export function useReleaseQueueView() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const [pendingPlan, setPendingPlan] = useState<number | null>(null)

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
      valueHint: '≈ —',
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

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    rows,
    onClaim,
  }
}
