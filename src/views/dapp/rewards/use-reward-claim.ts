import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import {
  resolveRewardClaimOutcome,
  type RewardClaimExecuteResult,
} from '~/core/rewards/resolve-reward-claim-outcome'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import {
  claimCommunityFund,
  claimTeamReward,
} from '~/web3/reward-claim'

type RewardClaimExecutor = (args: {
  wallet: NonNullable<ReturnType<typeof useActiveWallet>>
  token: string
  onUnauthorized: () => void
}) => Promise<RewardClaimExecuteResult>

export type RewardClaimStatus = 'success' | 'confirm_failed' | null

export function useRewardClaim(execute: RewardClaimExecutor) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, sessionReady, invalidateSession } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: Exclude<RewardClaimStatus, null>
    confirmResult: ClaimConfirmResult | null
    txHash?: string
  } | null> => {
    if (!account || !wallet || !token || !sessionReady) {
      setError(WALLET_GATE_ERROR.NOT_CONNECTED)
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const result = await execute({
        wallet,
        token,
        onUnauthorized: invalidateSession,
      })
      const outcome = resolveRewardClaimOutcome(result)
      if (outcome.shouldInvalidate) {
        invalidateAfterTeamClaim()
      }
      return {
        status: outcome.status,
        confirmResult: outcome.confirmResult as ClaimConfirmResult | null,
        txHash: outcome.txHash,
      }
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, execute, invalidateSession, sessionReady, token, wallet])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    claim,
    isClaiming,
    error,
    clearError,
    canClaim: Boolean(account && token && sessionReady),
  }
}

export function useTeamRewardClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimTeamReward>[0]) => claimTeamReward(args),
    [],
  )
  return useRewardClaim(execute)
}

export function useCommunityFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimCommunityFund>[0]) => claimCommunityFund(args),
    [],
  )
  return useRewardClaim(execute)
}
