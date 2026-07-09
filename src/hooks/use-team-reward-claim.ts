import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useState } from 'react'
import { useAuth } from '~/app/bootstrap/use-auth'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { executeTeamRewardClaim } from '~/views/dapp/web3/reward-claim'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'

export function useTeamRewardClaim() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { token, isAuthenticated } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  // Store the raw error so resolveTeamClaimError can dig into cause/data for the
  // revert selector (e.g. 0x66e6698b ErrorSignatureExpired).
  const [error, setError] = useState<unknown>(null)

  const claim = useCallback(async (): Promise<ClaimConfirmResult | null> => {
    if (!account || !wallet || !token || !isAuthenticated) {
      setError('Please connect wallet and sign in first')
      return null
    }

    setIsClaiming(true)
    setError(null)

    try {
      const { confirmResult } = await executeTeamRewardClaim({ wallet, token })
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
