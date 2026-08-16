import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readTurbineHasClaimable } from '~/web3/exchange/turbine-exchange-read'

/**
 * 导航栏 Exchange 条目的红点提示
 *
 * Turbine 存在冷却到期、可领取的仓位时点亮，提示用户领取。
 * 纯链读（按地址）；启用门闸与 Release 红点一致，用 walletReady。
 *
 * @param enabled 是否启用查询（通常为 walletReady）
 * @returns 是否存在可领取的 Turbine 仓位
 * @see 手册 §16 Turbine
 */
export function useTurbineExchangeRailDot(enabled: boolean) {
  const query = useChainQuery({
    queryKey: queryKeys.chain.turbineClaimable,
    queryFn: (addr) => readTurbineHasClaimable(addr),
    enabled,
  })

  return Boolean(query.data)
}
