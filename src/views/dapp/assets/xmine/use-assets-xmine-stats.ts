import { useQuery } from '@tanstack/react-query'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatBlockTime } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readXminePosition } from '~/web3/assets/assets-read'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/** Right-rail Xmine stats from `readXminePosition` + `miningQuotaOf`. */
export function useAssetsXmineStats(): string[] {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address

  const positionQuery = useQuery({
    queryKey: queryKeys.chain.assetsXminePosition(address ?? ''),
    queryFn: () => readXminePosition(address as Address, readClient),
    enabled: walletReady && Boolean(address),
  })

  const quotaQuery = useQuery({
    queryKey: queryKeys.chain.xminePreflight(address ?? ''),
    queryFn: () => readXminePreflight({ user: address!, client: readClient }),
    enabled: walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  if (!walletReady || !address) return ['—', '—', '—', '—']
  if (positionQuery.isError || quotaQuery.isError) return ['—', '—', '—', '—']
  if (positionQuery.data === undefined || quotaQuery.data === undefined) {
    return ['…', '…', '…', '…']
  }

  const { miningStake, pending, warmupGons, warmupEndTime } = positionQuery.data
  const warmupLabel =
    warmupGons > 0n && warmupEndTime > 0n ? formatBlockTime(Number(warmupEndTime)) : '0'

  return [
    formatTokenAmount(miningStake, GAGX_DECIMALS, 4),
    formatTokenAmount(pending, X_DECIMALS, 4),
    warmupLabel,
    formatTokenAmount(quotaQuery.data.miningQuota, GAGX_DECIMALS, 4),
  ]
}
