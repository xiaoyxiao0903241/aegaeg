import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
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

/** Release buffer read + pending state + claim toast → everything `ReleaseBufferWidget` renders. */
export function useReleaseBufferView() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)

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

  const claimableLabel = `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} AGX`
  const releasingLabel = `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} AGX`
  const releasedPctLabel = t.release.labels.releasedPct.replace('{pct}', pctLabel.replace('%', ''))
  const valueHint = formatApproxUsd(0, null)
  const progressWidth = pctLabel

  async function onClaim() {
    if (!canClaim) return
    await claim.mutate()
  }

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    claimableLabel,
    releasingLabel,
    releasedPctLabel,
    valueHint,
    progressWidth,
    canClaim,
    pending: claim.isPending,
    onClaim,
  }
}
