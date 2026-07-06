import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/auth-provider'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { executeCommunityFundClaim } from '~/views/dapp/web3/reward-claim'
import { useDappActions } from '~/stores/dapp-actions'

export function useCommunityFundClaim() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated } = useAuth()
  const afterTeamClaim = useDappActions((state) => state.afterTeamClaim)
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
      afterTeamClaim()
      return confirmResult
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, afterTeamClaim, isAuthenticated, token, wallet])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}
