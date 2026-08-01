import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { TRADE_TOKEN_ADDRESSES, type TradeTokenKey } from '~/views/dapp/exchange/exchange-pair'
import { useErc20AllowanceQuery, useErc20BalanceQuery } from '~/web3/erc20/use-erc20-queries'

type UseMarketTradeBalancesArgs = {
  address: string | undefined
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  /** 余额/授权读（Exchange tab 预热）。 */
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

  // 决策面：placeholder（含钱包切换 keepPreviousData）不算已加载。
  const balancesLoaded =
    isDecisionFresh(usd1Query.isPlaceholderData, usd1Query.data) &&
    isDecisionFresh(agxQuery.isPlaceholderData, agxQuery.data) &&
    isDecisionFresh(xQuery.isPlaceholderData, xQuery.data) &&
    isDecisionFresh(allowanceQuery.isPlaceholderData, allowanceQuery.data)

  const sellFresh = isDecisionFresh(
    sellKey === 'usd1'
      ? usd1Query.isPlaceholderData
      : sellKey === 'agx'
        ? agxQuery.isPlaceholderData
        : xQuery.isPlaceholderData,
    byKey[sellKey],
  )
  const buyFresh = isDecisionFresh(
    buyKey === 'usd1'
      ? usd1Query.isPlaceholderData
      : buyKey === 'agx'
        ? agxQuery.isPlaceholderData
        : xQuery.isPlaceholderData,
    byKey[buyKey],
  )

  const sellDecision = sellFresh ? decisionBigint(byKey[sellKey], false) : undefined
  const buyDecision = buyFresh ? decisionBigint(byKey[buyKey], false) : undefined
  const allowanceDecision = decisionBigint(allowanceQuery.data, allowanceQuery.isPlaceholderData)

  return {
    /** 决策用：非 fresh 时为 0，且须配合 balancesLoaded。 */
    sellBalance: sellDecision ?? 0n,
    buyBalance: buyDecision ?? 0n,
    /** 展示用：可含 placeholder 旧值。 */
    sellBalanceKnown: byKey[sellKey] !== undefined,
    buyBalanceKnown: byKey[buyKey] !== undefined,
    balanceByKey: {
      usd1: byKey.usd1 ?? 0n,
      agx: byKey.agx ?? 0n,
      x: byKey.x ?? 0n,
    } satisfies Record<TradeTokenKey, bigint>,
    balanceKnownByKey: {
      usd1: byKey.usd1 !== undefined,
      agx: byKey.agx !== undefined,
      x: byKey.x !== undefined,
    } satisfies Record<TradeTokenKey, boolean>,
    allowance: allowanceDecision ?? 0n,
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
