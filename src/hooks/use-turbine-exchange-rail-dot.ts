import { queryKeys } from '~/shared/api/query/query-keys'
import { readTurbineHasClaimable } from '~/web3/exchange/turbine-exchange-read'
import { useChainQuery } from '~/hooks/use-chain-query'

/** EX-U4: exchange rail red-dot when Turbine has vested claimable rows. */
export function useTurbineExchangeRailDot(enabled: boolean) {
  const query = useChainQuery({
    queryKey: queryKeys.chain.turbineClaimable,
    queryFn: (addr) => readTurbineHasClaimable(addr),
    enabled,
  })

  return Boolean(query.data)
}
