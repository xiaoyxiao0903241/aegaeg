import { useQuery } from '@tanstack/react-query'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readIsBindReferral } from '~/web3/referral/referral-read'
import { useChainReadClient } from '~/web3/use-chain-read-client'

type ReferralQueryOptions = {
  enabled?: boolean
}

/** Cross-rail bind check — SSOT for connect warm + genesis/community. */
export function useIsBindReferralQuery(address?: string, options?: ReferralQueryOptions) {
  const readClient = useChainReadClient()
  const queryEnabled = (options?.enabled ?? true) && Boolean(address)

  return useQuery({
    queryKey: queryKeys.chain.referralIsBound(address ?? ''),
    queryFn: () => readIsBindReferral(address!, readClient),
    enabled: queryEnabled,
    staleTime: QUERY_STALE_TIME.balances,
  })
}
