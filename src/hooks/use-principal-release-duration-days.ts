import { SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { readEffectiveReleaseDuration } from '~/web3/release/release-read'

/**
 * 分流器新单释放周期（天）。
 *
 * 走 Manager.effectiveDuration(user)。未就绪时调用方用 `?? 30` / `?? '—'`。
 *
 * @see 手册 §13 分流器本金释放
 */
export function usePrincipalReleaseDurationDays() {
  return useChainQuery({
    queryKey: [...queryKeys.chain.releaseDuration, 'effective'] as const,
    queryFn: async (addr) => {
      const seconds = await readEffectiveReleaseDuration(addr as Address)
      const days = Number(seconds / SECONDS_PER_DAY)
      return Number.isFinite(days) && days > 0 ? days : 30
    },
  })
}
