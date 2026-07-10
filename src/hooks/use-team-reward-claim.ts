import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { executeTeamRewardClaim } from '~/views/dapp/web3/reward-claim'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'

export type TeamRewardClaimStatus = 'success' | 'confirm_failed' | null

export function useTeamRewardClaim() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  // Store the raw error so resolveTeamClaimError can dig into cause/data for the
  // revert selector (e.g. 0x66e6698b ErrorSignatureExpired).
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: Exclude<TeamRewardClaimStatus, null>
    confirmResult: ClaimConfirmResult | null
  } | null> => {
    if (!account || !wallet || !token || !isAuthenticated) {
      setError('Please connect wallet and sign in first')
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const result = await executeTeamRewardClaim({ wallet, token })
      // On-chain success always refreshes claimable totals — even if confirm fails.
      invalidateAfterTeamClaim()
      if (result.confirmError) {
        // Do not setError: callers toast confirmSyncFailed once via status.
        // Setting CLAIM_CONFIRM_SYNC_FAILED would double-fire the error effect toast.
        return { status: 'confirm_failed', confirmResult: null }
      }
      return { status: 'success', confirmResult: result.confirmResult }
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, isAuthenticated, token, wallet])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}
