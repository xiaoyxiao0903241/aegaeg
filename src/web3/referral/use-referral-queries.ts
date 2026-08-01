import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readIsBindReferral } from '~/web3/referral/referral-read'

type ReferralQueryOptions = {
  enabled?: boolean
}

/**
 * U-tier bind display for Genesis (and any future display consumers).
 * Live L-tier paths (purchase re-check, community bind, prefetch, staking preflight)
 * call `readIsBindReferral` / `fetchQuery` directly — do not treat this hook as the
 * only owner of bind truth.
 */
export function useIsBindReferralQuery(address?: string, options?: ReferralQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.referralIsBoundOf(address ?? ''),
    scope: 'public',
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(address),
    queryFn: () => readIsBindReferral(address!),
  })
}
