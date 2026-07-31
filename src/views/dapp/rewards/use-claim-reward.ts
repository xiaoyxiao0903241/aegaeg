import { WALLET_BLOCKED } from '~/web3/contract-error-message'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useCallback } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import type { ClaimConfirmResult } from '~/shared/api/types'
import {
  claimRewardOutcome,
  type ClaimRewardExecuteResult,
} from '~/core/rewards/claim-reward-outcome'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import {
  claimCommunityFund,
  claimMarketFundReward,
  claimTeamReward,
} from '~/web3/claim/claim-reward'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import type { WriteSession } from '~/web3/wallet/require-write-session'

type RewardClaimExecutor = (args: {
  wallet: WriteSession['wallet']
  token: string
  onUnauthorized: () => void
}) => Promise<ClaimRewardExecuteResult>

/** UI-facing claim result — `confirm_failed` is success-path (not thrown). */
export type ClaimRewardUiResult = {
  status: 'success' | 'confirm_failed'
  confirmResult: ClaimConfirmResult | null
  txHash?: string
}

export function useClaimReward(execute: RewardClaimExecutor) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const { token, sessionReady, invalidateSession } = useAuth()

  const claimMutation = useChainMutation({
    path: WRITE_PATH.REWARD_CLAIM,
    mutation: async (_vars, session): Promise<ClaimRewardUiResult> => {
      if (!token || !sessionReady || !writeReady) {
        throw WALLET_BLOCKED.NOT_CONNECTED
      }

      const result = await execute({
        wallet: session.wallet,
        token,
        onUnauthorized: invalidateSession,
      })
      const outcome = claimRewardOutcome(result)
      // confirm_failed: on-chain succeeded — do not throw; views toast.warning vs success.
      if (outcome.shouldInvalidate) {
        invalidateAfterTeamClaim()
      }
      return {
        status: outcome.status,
        confirmResult: outcome.confirmResult as ClaimConfirmResult | null,
        txHash: outcome.txHash,
      }
    },
  })

  return {
    claim: () => claimMutation.mutate(),
    isClaiming: claimMutation.isPending,
    canClaim: Boolean(account && token && sessionReady && writeReady) && !claimMutation.isLocked,
  }
}

export function useTeamRewardClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimTeamReward>[0]) => claimTeamReward(args),
    [],
  )
  return useClaimReward(execute)
}

export function useMarketFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimMarketFundReward>[0]) => claimMarketFundReward(args),
    [],
  )
  return useClaimReward(execute)
}

export function useCommunityFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimCommunityFund>[0]) => claimCommunityFund(args),
    [],
  )
  return useClaimReward(execute)
}
