import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { executeCommunityFundClaim } from '~/views/dapp/web3/reward-claim'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'

export function useCommunityFundClaim() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<{
    status: 'success' | 'confirm_failed'
    confirmResult: ClaimConfirmResult | null
  } | null> => {
    if (!account || !wallet || !token || !isAuthenticated) {
      setError('Please connect wallet and sign in first')
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const result = await executeCommunityFundClaim({ wallet, token })
      invalidateAfterTeamClaim()
      if (result.confirmError) {
        // Status-driven toast only — avoid setError double toast with the error effect.
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
