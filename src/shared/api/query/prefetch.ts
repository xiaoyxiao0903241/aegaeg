import { queryClient } from '~/shared/api/query/query-client'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { TAB_QUERY_KEYS } from '~/shared/api/query/tab-query-keys'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { readIsBindReferral } from '~/web3/referral/referral-read'

/** 连接后需暖热的代币——Trade/Flash 卖出面（无需授权）。 */
const CONNECT_WARM_TOKENS: readonly Address[] = [
  BSC_CONTRACTS.agx,
  BSC_CONTRACTS.usd1,
  BSC_CONTRACTS.gagx,
  BSC_CONTRACTS.usdt,
  BSC_CONTRACTS.xToken,
]

/**
 * 登录且在 BSC 上后预取推荐绑定状态与核心 ERC20 余额。
 * 使用并行 `prefetchQuery`（原子键）；Multicall3 聚合读取保持可选。
 */
export function prefetchConnectWarm(address: string): void {
  void queryClient.prefetchQuery({
    queryKey: queryKeys.chain.referralIsBoundOf(address),
    queryFn: () => readIsBindReferral(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  for (const token of CONNECT_WARM_TOKENS) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.chain.erc20BalanceOf(token, address),
      queryFn: () => readErc20Balance(token, address),
      staleTime: QUERY_STALE_TIME.balances,
    })
  }
}

/**
 * 暖热某 Tab 各查询根的未激活观察者（悬停 / 回访）。
 * 只 refetch 已 stale 的 inactive 查询；fresh 缓存不动。从未 fetch 的 key 无观察者 → no-op。
 */
export function prefetchTabQueries(tab: DappTab): void {
  for (const queryKey of TAB_QUERY_KEYS[tab]) {
    void queryClient.refetchQueries({ queryKey, type: 'inactive', stale: true })
  }
}
