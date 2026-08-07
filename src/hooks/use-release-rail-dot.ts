import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readReleaseHasClaimable } from '~/web3/release/release-read'

/**
 * 导航栏 Release 条目的红点提示
 *
 * 释放队列或本金缓冲池存在可领取 AGX 时点亮，提示用户有奖励待领取。
 *
 * @param enabled 是否启用查询（通常为 walletReady；与 Exchange 红点一致）
 * @returns 是否存在可领取的释放奖励
 * @see 手册 §12 RewardQueue 奖励释放队列
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */
export function useReleaseRailDot(enabled: boolean) {
  const query = useChainQuery({
    queryKey: queryKeys.chain.releaseClaimable,
    queryFn: (addr) => readReleaseHasClaimable(addr as `0x${string}`),
    enabled,
  })

  return Boolean(query.data)
}
