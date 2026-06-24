import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/providers/auth-provider'
import type { ClaimConfirmResult } from '~/lib/api/types'
import { executeTeamRewardClaim } from '~/web3/reward-claim'
import { useDappActions } from '~/stores/dapp-actions'

export function useTeamRewardClaim() {
  const account = useActiveAccount()
  const { token, isAuthenticated } = useAuth()
  const afterTeamClaim = useDappActions((state) => state.afterTeamClaim)
  const [isClaiming, setIsClaiming] = useState(false)
  // Store the raw error so resolveTeamClaimError can dig into cause/data for the
  // revert selector (e.g. 0x66e6698b ErrorSignatureExpired).
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<ClaimConfirmResult | null> => {
    if (!account || !token || !isAuthenticated) {
      setError('Please connect wallet and sign in first')
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const { confirmResult } = await executeTeamRewardClaim({ account, token })
      afterTeamClaim()
      return confirmResult
    } catch (caught) {

      setError(caught)
      return null
    } finally {
      setIsClaiming(false)
    }
  }, [account, afterTeamClaim, isAuthenticated, token])

  return { claim, isClaiming, error, canClaim: Boolean(account && token && isAuthenticated) }
}
