import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import {
  executeCommunityFundClaim,
  executeTeamRewardClaim,
} from '~/views/dapp/web3/reward-claim'

type RewardClaimExecuteResult = {
  confirmError?: unknown
  confirmResult: ClaimConfirmResult | null
  txHash: string
}

type RewardClaimExecutor = (args: {
  wallet: NonNullable<ReturnType<typeof useActiveWallet>>
  token: string
  onUnauthorized: () => void
}) => Promise<RewardClaimExecuteResult>

export type RewardClaimStatus = 'success' | 'confirm_failed' | null

export function useRewardClaim(execute: RewardClaimExecutor) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated, invalidateSession } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: Exclude<RewardClaimStatus, null>
    confirmResult: ClaimConfirmResult | null
    txHash?: string
  } | null> => {
    if (!account || !wallet || !token || !isAuthenticated) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
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
      if (result.confirmError) {
        // 链上已成功：不乐观清空余额/日志；仅提示后端同步失败。
        return {
          status: 'confirm_failed',
          confirmResult: null,
          txHash: result.txHash,
        }
      }
      invalidateAfterTeamClaim()
      return { status: 'success', confirmResult: result.confirmResult, txHash: result.txHash }
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, execute, invalidateSession, isAuthenticated, token, wallet])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}

export function useTeamRewardClaim() {
  const execute = useCallback(
    (args: Parameters<typeof executeTeamRewardClaim>[0]) => executeTeamRewardClaim(args),
    [],
  )
  return useRewardClaim(execute)
}

export function useCommunityFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof executeCommunityFundClaim>[0]) => executeCommunityFundClaim(args),
    [],
  )
  return useRewardClaim(execute)
}
