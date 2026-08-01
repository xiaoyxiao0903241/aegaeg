import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
} from '~/web3/assets/assets-read'

export type AssetsProduct = 'stake' | 'lpbond' | 'burnbond'

/** Shared stake/bond position reads for widget table + right-rail stats. */
export function useAssetsPositionQueries(product: AssetsProduct) {
  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
    enabled: product === 'stake',
  })

  const bondQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions(product),
    queryFn: (addr) =>
      product === 'lpbond'
        ? readLpBondPositions(addr as Address)
        : readBurnBondPositions(addr as Address),
    enabled: product !== 'stake',
  })

  return { stakeQuery, bondQuery }
}
