import { useState } from 'react'
import { zeroAddress } from 'viem'

import { ZERO_BI } from '~/core/constants'
import { clampGenesisShares } from '~/core/presale/presale-math'
import { useI18n } from '~/i18n/use-i18n'
import { genesisPurchaseSummary } from '~/views/dapp/genesis/shared'
import { useGenesisChainReads } from '~/views/dapp/genesis/use-genesis-chain-reads'
import { useGenesisCountdownClock } from '~/views/dapp/genesis/use-genesis-countdown-clock'
import { useGenesisPurchaseActions } from '~/views/dapp/genesis/use-genesis-purchase-actions'
import { usePresalePreviewAirdropValueQuery } from '~/web3/presale/use-presale-queries'
import { useActiveWallet } from '~/web3/thirdweb-react'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

/** 组装创世读取与购买动作，作为提升到会话的公开属性接口 */
export function useGenesisSession() {
  const { messages: t } = useI18n()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const reads = useGenesisChainReads()
  const clock = useGenesisCountdownClock(reads.phases, reads.address, t.genesis.countdownUnits)
  const [sharesDraft, setSharesDraft] = useState(0)

  const shares = clampGenesisShares(sharesDraft, reads.maxShares)
  const purchaseAmount =
    reads.sharePriceWei > ZERO_BI ? reads.sharePriceWei * BigInt(shares) : ZERO_BI
  const previewUser = reads.address ?? zeroAddress
  const previewQuery = usePresalePreviewAirdropValueQuery(
    previewUser,
    reads.phaseIndex,
    purchaseAmount,
    { enabled: reads.purchaseQueriesEnabled },
  )

  const model = genesisPurchaseSummary({
    reads,
    sharesDraft,
    countdown: clock.countdown,
    countdownMode: clock.countdownMode,
    previewAddedAirdropValueWei: previewQuery.data,
  })
  const canPurchaseBase = model.canPurchase && writeReady

  const actions = useGenesisPurchaseActions({
    wallet: {
      account: reads.account,
      wallet,
      address: reads.address,
    },
    phase: {
      activePhase: reads.activePhase,
      isPaused: reads.isPaused,
      isPausedUnknown: reads.isPausedUnknown,
      isBoundQueryData: reads.isBoundQueryData,
    },
    purchase: {
      canPurchase: canPurchaseBase,
      purchaseAmount: model.purchaseAmount,
    },
  })

  function setShares(next: number) {
    // 改份额等于换了一笔购买，先解除上次未知结果锁定
    actions.clearLock()
    setSharesDraft(next)
  }

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
    canPurchase: canPurchaseBase && !actions.isLocked,
    isLoading: reads.isLoading,
    isSubmitting: actions.isSubmitting,
    error: reads.error,
    refresh: actions.refresh,
    submitPurchase: actions.submitPurchase,
  }
}
