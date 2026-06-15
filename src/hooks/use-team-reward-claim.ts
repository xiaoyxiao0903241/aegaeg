import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useState } from 'react'
import { useAuth } from '../providers/auth-provider'
import { executeTeamRewardClaim } from '../web3/reward-claim'

export function useTeamRewardClaim() {
  const account = useActiveAccount()
  const { token, isAuthenticated } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const claim = useCallback(async () => {
    if (!account || !token || !isAuthenticated) {
      setError('Please connect wallet and sign in first')
      return false
    }

    setIsClaiming(true)
    setError(null)

    try {
      await executeTeamRewardClaim({ account, token })
      return true
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Claim failed')
      return false
    } finally {
      setIsClaiming(false)
    }
  }, [account, isAuthenticated, token])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}
