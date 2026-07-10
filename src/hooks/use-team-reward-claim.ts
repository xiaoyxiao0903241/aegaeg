import { useCallback } from 'react'
import { executeTeamRewardClaim } from '~/views/dapp/web3/reward-claim'
import { useRewardClaim } from '~/hooks/use-reward-claim'

export type TeamRewardClaimStatus = 'success' | 'confirm_failed' | null

export function useTeamRewardClaim() {
  const execute = useCallback(
    (args: Parameters<typeof executeTeamRewardClaim>[0]) => executeTeamRewardClaim(args),
    [],
  )
  return useRewardClaim(execute)
}
