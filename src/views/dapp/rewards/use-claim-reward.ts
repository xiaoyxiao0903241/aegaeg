import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import {
  resolveClaimRewardOutcome,
  type ClaimRewardExecuteResult,
} from '~/core/rewards/resolve-claim-reward-outcome'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import {
  claimIncentiveReward,
  claimMarketFundReward,
  claimTeamReward,
} from '~/web3/claim/claim-reward'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
} from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

type RewardClaimExecutor = (args: {
  wallet: NonNullable<ReturnType<typeof useActiveWallet>>
  token: string
  onUnauthorized: () => void
}) => Promise<ClaimRewardExecuteResult>

export type RewardClaimStatus = 'success' | 'confirm_failed' | null

export function useClaimReward(execute: RewardClaimExecutor) {
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
    if (isUnknownReceiptLocked(WRITE_PATH.REWARD_CLAIM)) {
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
      const outcome = resolveClaimRewardOutcome(result)
      if (outcome.shouldInvalidate) {
        invalidateAfterTeamClaim()
      }
      clearUnknownReceiptLock(WRITE_PATH.REWARD_CLAIM)
      return {
        status: outcome.status,
        confirmResult: outcome.confirmResult as ClaimConfirmResult | null,
        txHash: outcome.txHash,
      }
    } catch (caught) {
      if (isUnknownSubmitOutcome(caught)) {
        lockUnknownReceipt(WRITE_PATH.REWARD_CLAIM)
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
    canClaim:
      Boolean(account && token && sessionReady && writeReady) &&
      !isUnknownReceiptLocked(WRITE_PATH.REWARD_CLAIM),
  }
}

export function useTeamRewardClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimTeamReward>[0]) => claimTeamReward(args),
    [],
  )
  return useClaimReward(execute)
}

export function useIncentiveClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimIncentiveReward>[0]) => claimIncentiveReward(args),
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

export function useGenesisRewardClaim() {
  return useTeamRewardClaim()
}
