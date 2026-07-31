import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readIsBindReferral } from '~/web3/referral/referral-read'

type ReferralQueryOptions = {
  enabled?: boolean
}

/** Cross-rail bind check — SSOT for connect warm + genesis/community. */
export function useIsBindReferralQuery(address?: string, options?: ReferralQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.referralIsBoundOf(address ?? ''),
    scope: 'public',
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(address),
    queryFn: () => readIsBindReferral(address!),
  })
}
