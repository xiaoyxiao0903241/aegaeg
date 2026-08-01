import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { TRADE_TOKEN_ADDRESSES, type TradeTokenKey } from '~/views/dapp/exchange/exchange-pair'
import { useErc20AllowanceQuery, useErc20BalanceQuery } from '~/web3/erc20/use-erc20-queries'

type UseMarketTradeBalancesArgs = {
  address: string | undefined
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  /** Balance / allowance reads (Exchange-tab warm). */
  readsEnabled: boolean
  walletReady: boolean
}

/** ERC20 balances for USD1/AGX/X + router allowance for the active sell token. */
export function useMarketTradeBalances({
  address,
  sellKey,
  buyKey,
  readsEnabled,
  walletReady,
}: UseMarketTradeBalancesArgs) {
  /** Public ERC20 keys need owner; walletReady only for loading chrome. */
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

  const balancesLoaded =
    usd1Query.data !== undefined &&
    agxQuery.data !== undefined &&
    xQuery.data !== undefined &&
    allowanceQuery.data !== undefined

  return {
    sellBalance: byKey[sellKey] ?? 0n,
    buyBalance: byKey[buyKey] ?? 0n,
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
    allowance: allowanceQuery.data ?? 0n,
    balancesLoaded,
    isBalancesLoading:
      walletReady &&
      (usd1Query.isLoading || agxQuery.isLoading || xQuery.isLoading || allowanceQuery.isLoading),
  }
}
