import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/auth-provider'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { executeCommunityFundClaim } from '~/views/dapp/web3/reward-claim'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'

export function useCommunityFundClaim() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<ClaimConfirmResult | null> => {
    if (!account || !wallet || !token || !isAuthenticated) {
      setError('Please connect wallet and sign in first')
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const { confirmResult } = await executeCommunityFundClaim({ wallet, token })
      invalidateAfterTeamClaim()
      return confirmResult
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, isAuthenticated, token, wallet])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}
