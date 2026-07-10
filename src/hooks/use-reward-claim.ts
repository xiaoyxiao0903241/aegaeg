import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import {
  claimCommunityFund,
  claimTeamReward,
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
  const { token, sessionReady, invalidateSession } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: Exclude<RewardClaimStatus, null>
    confirmResult: ClaimConfirmResult | null
    txHash?: string
  } | null> => {
    if (!account || !wallet || !token || !sessionReady) {
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
  }, [account, execute, invalidateSession, sessionReady, token, wallet])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && sessionReady) }
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
