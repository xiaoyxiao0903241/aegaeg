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
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearPendingUnknownLatch,
  isPendingUnknownLatched,
  latchPendingUnknown,
} from '~/web3/wallet/pending-unknown-latch'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

type RewardClaimExecutor = (args: {
  wallet: NonNullable<ReturnType<typeof useActiveWallet>>
  token: string
  onUnauthorized: () => void
}) => Promise<RewardClaimExecuteResult>

export type RewardClaimStatus = 'success' | 'confirm_failed' | null

export function useRewardClaim(execute: RewardClaimExecutor) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const { token, sessionReady, invalidateSession } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: Exclude<RewardClaimStatus, null>
    confirmResult: ClaimConfirmResult | null
    txHash?: string
  } | null> => {
    if (!account || !wallet || !token || !sessionReady || !writeReady) {
      setError(WALLET_GATE_ERROR.NOT_CONNECTED)
      return null
    }
    if (isPendingUnknownLatched(WRITE_PATH.REWARD_CLAIM)) {
      setError(WALLET_GATE_ERROR.PENDING_UNKNOWN)
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
      clearPendingUnknownLatch(WRITE_PATH.REWARD_CLAIM)
      return {
        status: outcome.status,
        confirmResult: outcome.confirmResult as ClaimConfirmResult | null,
        txHash: outcome.txHash,
      }
    } catch (caught) {
      if (isUnknownSubmitOutcome(caught)) {
        latchPendingUnknown(WRITE_PATH.REWARD_CLAIM)
      }
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, execute, invalidateSession, sessionReady, token, wallet, writeReady])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    claim,
    isClaiming,
    error,
    clearError,
    canClaim: Boolean(account && token && sessionReady && writeReady) &&
      !isPendingUnknownLatched(WRITE_PATH.REWARD_CLAIM),
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
