import { SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import {
  readEffectiveReleaseDuration,
  readPrincipalReleaseDuration,
} from '~/web3/release/release-read'

/**
 * 分流器新单释放周期（天）。
 *
 * 已连钱包：Manager.effectiveDuration(user)；否则 DEFAULT_RELEASE_DURATION。缺省回落 30。
 */
export function usePrincipalReleaseDurationDays() {
  const { walletReady } = useDappHost()
  const walletDays = useChainQuery({
    queryKey: [...queryKeys.chain.releaseDuration, 'effective'] as const,
    enabled: walletReady,
    queryFn: async (addr) => {
      const seconds = await readEffectiveReleaseDuration(addr as Address)
      const days = Number(seconds / SECONDS_PER_DAY)
      return Number.isFinite(days) && days > 0 ? days : 30
    },
  })
  const publicDays = useChainQuery({
    queryKey: queryKeys.chain.releaseDuration,
    scope: 'public',
    freshness: 'api',
    enabled: !walletReady,
    queryFn: async () => {
      const seconds = await readPrincipalReleaseDuration()
      const days = Number(seconds / SECONDS_PER_DAY)
      return Number.isFinite(days) && days > 0 ? days : 30
    },
  })
  return walletReady ? walletDays : publicDays
}
