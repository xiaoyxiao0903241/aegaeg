import { toast } from 'sonner'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { canClaimWhen } from '~/core/wallet/write-cta'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseBufferClaim } from '~/views/dapp/release/submit-release'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** Release buffer read + pending state + claim toast → everything `ReleaseBufferWidget` renders. */
export function useReleaseBufferView() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)

  const claim = useChainMutation({
    path: WRITE_PATH.RELEASE_CLAIM,
    mutation: () => submitReleaseBufferClaim({ account, wallet, readClient }),
    onSuccess: async () => {
      toast.success(t.release.buffer.claimSuccess)
      await bufferQuery.refetch()
    },
  })

  const dash = t.release.dash
  const claimable = bufferQuery.data?.totalClaimable ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const canClaim = canClaimWhen({
    walletReady,
    writeReady,
    unknownReceiptLocked: claim.isLocked,
    claimable,
  })
  const pctLabel = formatReleasePct(claimable, releasing)

  const claimableLabel = walletReady ? `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} AGX` : dash
  const releasingLabel = walletReady ? `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} AGX` : dash
  const releasedPctLabel = t.release.labels.releasedPct.replace('{pct}', pctLabel.replace('%', ''))
  const valueHint = walletReady ? '≈ —' : dash
  const progressWidth = walletReady ? pctLabel : '0%'

  async function onClaim() {
    if (!canClaim) return
    await claim.mutate()
  }

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    dash,
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
