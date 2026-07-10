import { useEffect, useRef, useState } from 'react'
import { useActiveWallet } from '~/web3/thirdweb-react'
import {
  buildPhaseCountdownKey,
  hasPhaseCountdownElapsed,
} from '~/core/presale/presale-math'
import { invalidateAfterGenesisPhaseTransition } from '~/shared/api/query/invalidate'
import { useI18n } from '~/i18n/use-i18n'
import { buildGenesisWidgetModel } from '~/views/dapp/genesis/build-genesis-widget-model'
import { useGenesisChainReads } from '~/views/dapp/genesis/use-genesis-chain-reads'
import {
  useGenesisPurchaseActions,
  type GenesisPurchaseResult,
} from '~/views/dapp/genesis/use-genesis-purchase-actions'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

export type { GenesisPurchaseResult }

/** Assembles Genesis reads + purchase actions; public API for lifted session props. */
export function useGenesisWidget() {
  const { messages: t } = useI18n()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const reads = useGenesisChainReads()
  const countdownRefreshRef = useRef<string | null>(null)
  const [sharesDraft, setSharesDraft] = useState(0)

  const model = buildGenesisWidgetModel({
    reads,
    sharesDraft,
    countdownUnits: t.genesis.countdownUnits,
  })
  const canPurchase = model.canPurchase && writeReady

  function setShares(next: number) {
    setSharesDraft(next)
  }

  const actions = useGenesisPurchaseActions({
    account: reads.account,
    wallet,
    address: reads.address,
    activePhase: reads.activePhase,
    canPurchase,
    isApproved: model.isApproved,
    needsApproval: model.needsApproval,
    purchaseAmount: model.purchaseAmount,
    isBoundQueryData: reads.isBoundQueryData,
    isPaused: reads.isPaused,
    isPausedUnknown: reads.isPausedUnknown,
  })

  useEffect(() => {
    const countdownTarget = reads.countdownTarget
    if (
      !countdownTarget ||
      !hasPhaseCountdownElapsed(countdownTarget.targetTime, reads.nowSeconds)
    ) {
      return
    }

    const countdownKey = buildPhaseCountdownKey(countdownTarget)
    if (!countdownKey || countdownRefreshRef.current === countdownKey) {
      return
    }

    countdownRefreshRef.current = countdownKey
    invalidateAfterGenesisPhaseTransition(reads.address)
  }, [reads.address, reads.countdownTarget, reads.nowSeconds])

  return {
    shares: model.shares,
    setShares,
    maxShares: reads.maxShares,
    phases: reads.phases,
    activePhase: reads.activePhase,
    phaseIndex: reads.phaseIndex,
    ...model.display,
    walletReady: reads.walletReady,
    needsReferralBind: reads.needsReferralBind,
    needsApproval: model.needsApproval,
    isApproved: model.isApproved,
    hasSufficientBalance: model.hasSufficientBalance,
    canPurchase,
    isLoading: reads.isLoading,
    isSubmitting: actions.isSubmitting,
    submittingAction: actions.submittingAction,
    error: reads.error,
    refresh: actions.refresh,
    approve: actions.approve,
    purchase: actions.purchase,
    submitPurchase: actions.submitPurchase,
  }
}
