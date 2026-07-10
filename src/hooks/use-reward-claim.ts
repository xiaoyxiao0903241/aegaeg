import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'

type RewardClaimExecuteResult = {
  confirmError?: unknown
  confirmResult: ClaimConfirmResult | null
}

type RewardClaimExecutor = (args: {
  wallet: NonNullable<ReturnType<typeof useActiveWallet>>
  token: string
}) => Promise<RewardClaimExecuteResult>

export type RewardClaimStatus = 'success' | 'confirm_failed' | null

export function useRewardClaim(execute: RewardClaimExecutor) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: Exclude<RewardClaimStatus, null>
    confirmResult: ClaimConfirmResult | null
  } | null> => {
    if (!account || !wallet || !token || !isAuthenticated) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const result = await execute({ wallet, token })
      invalidateAfterTeamClaim()
      if (result.confirmError) {
        return { status: 'confirm_failed', confirmResult: null }
      }
      return { status: 'success', confirmResult: result.confirmResult }
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, execute, isAuthenticated, token, wallet])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}
