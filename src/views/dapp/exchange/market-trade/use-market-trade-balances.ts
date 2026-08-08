import { ZERO_BI } from '~/core/constants'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { TRADE_TOKEN_ADDRESSES, type TradeTokenKey } from '~/views/dapp/exchange/shared'
import { useErc20AllowanceQuery, useErc20BalanceQuery } from '~/web3/erc20/use-erc20-queries'

type UseMarketTradeBalancesArgs = {
  address: string | undefined
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  /** 余额 / 授权查询开关（仅挂载中的市价交易会话）。 */
  readsEnabled: boolean
  walletReady: boolean
}

/** USD1/AGX/X 余额 + 当前卖出币对 Router 授权。 */
export function useMarketTradeBalances({
  address,
  sellKey,
  buyKey,
  readsEnabled,
  walletReady,
}: UseMarketTradeBalancesArgs) {
  const enabled = readsEnabled && Boolean(address)
  const sellAddress = TRADE_TOKEN_ADDRESSES[sellKey]

  const usd1Query = useErc20BalanceQuery(TRADE_TOKEN_ADDRESSES.usd1 as Address, address, {
    enabled,
  })
  const agxQuery = useErc20BalanceQuery(TRADE_TOKEN_ADDRESSES.agx as Address, address, { enabled })
  const xQuery = useErc20BalanceQuery(TRADE_TOKEN_ADDRESSES.x as Address, address, { enabled })
  const allowanceQuery = useErc20AllowanceQuery(
    sellAddress as Address,
    address,
    EXCHANGE_CONFIG.router,
    { enabled },
  )

  const byKey: Record<TradeTokenKey, bigint | undefined> = {
    usd1: usd1Query.data,
    agx: agxQuery.data,
    x: xQuery.data,
  }
  const placeholderByKey: Record<TradeTokenKey, boolean> = {
    usd1: usd1Query.isPlaceholderData,
    agx: agxQuery.isPlaceholderData,
    x: xQuery.isPlaceholderData,
  }

  // 判断用余额：含钱包切换时的旧值（keepPreviousData）不算已加载
  const balancesLoaded =
    isDecisionFresh(usd1Query.isPlaceholderData, usd1Query.data) &&
    isDecisionFresh(agxQuery.isPlaceholderData, agxQuery.data) &&
    isDecisionFresh(xQuery.isPlaceholderData, xQuery.data) &&
    isDecisionFresh(allowanceQuery.isPlaceholderData, allowanceQuery.data)

  return {
    /** 判断用余额：数据不新鲜时置 0，须配合 balancesLoaded 使用。 */
    sellBalance: decisionBigint(byKey[sellKey], placeholderByKey[sellKey]) ?? ZERO_BI,
    buyBalance: decisionBigint(byKey[buyKey], placeholderByKey[buyKey]) ?? ZERO_BI,
    /** 展示用余额：允许旧值（勿与判断用的零值混画）。 */
    sellBalanceKnown: byKey[sellKey] !== undefined,
    buyBalanceKnown: byKey[buyKey] !== undefined,
    balanceByKey: {
      usd1: byKey.usd1 ?? ZERO_BI,
      agx: byKey.agx ?? ZERO_BI,
      x: byKey.x ?? ZERO_BI,
    } satisfies Record<TradeTokenKey, bigint>,
    balanceKnownByKey: {
      usd1: byKey.usd1 !== undefined,
      agx: byKey.agx !== undefined,
      x: byKey.x !== undefined,
    } satisfies Record<TradeTokenKey, boolean>,
    allowance: decisionBigint(allowanceQuery.data, allowanceQuery.isPlaceholderData) ?? ZERO_BI,
    balancesLoaded,
    isBalancesLoading:
      walletReady &&
      (!balancesLoaded ||
        usd1Query.isLoading ||
        agxQuery.isLoading ||
        xQuery.isLoading ||
        allowanceQuery.isLoading),
  }
}
