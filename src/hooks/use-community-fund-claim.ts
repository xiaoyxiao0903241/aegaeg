import { useCallback } from 'react'
import { executeCommunityFundClaim } from '~/views/dapp/web3/reward-claim'
import { useRewardClaim } from '~/hooks/use-reward-claim'

export function useCommunityFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof executeCommunityFundClaim>[0]) => executeCommunityFundClaim(args),
    [],
  )
  return useRewardClaim(execute)
}
