import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { useErc20AllowanceQuery, useErc20BalanceQuery } from '~/web3/erc20/use-erc20-queries'

type UseMarketTradeBalancesArgs = {
  address: string | undefined
  sellAddress: `0x${string}`
  buyAddress: `0x${string}`
  quotesEnabled: boolean
  walletReady: boolean
}

/** Atomic ERC20 sell/buy balances + router allowance for the active trade pair. */
export function useMarketTradeBalances({
  address,
  sellAddress,
  buyAddress,
  quotesEnabled,
  walletReady,
}: UseMarketTradeBalancesArgs) {
  const enabled = quotesEnabled && walletReady && Boolean(address)

  const sellQuery = useErc20BalanceQuery(sellAddress as Address, address, { enabled })
  const buyQuery = useErc20BalanceQuery(buyAddress as Address, address, { enabled })
  const allowanceQuery = useErc20AllowanceQuery(
    sellAddress as Address,
    address,
    EXCHANGE_CONFIG.router,
    { enabled },
  )

  const balancesLoaded =
    sellQuery.data !== undefined && buyQuery.data !== undefined && allowanceQuery.data !== undefined

  async function refetchBalances(): Promise<{
    data?: { sell: bigint }
    error: Error | null
  }> {
    const [sell, ,] = await Promise.all([
      sellQuery.refetch(),
      buyQuery.refetch(),
      allowanceQuery.refetch(),
    ])
    if (sell.error || sell.data === undefined) {
      return { data: undefined, error: sell.error ?? new Error('EXCHANGE_SUBMIT_GATE_FAILED') }
    }
    return { data: { sell: sell.data }, error: null }
  }

  return {
    balancesQuery: { refetch: refetchBalances },
    sellBalance: sellQuery.data ?? 0n,
    buyBalance: buyQuery.data ?? 0n,
    allowance: allowanceQuery.data ?? 0n,
    balancesLoaded,
    isBalancesLoading:
      walletReady && (sellQuery.isLoading || buyQuery.isLoading || allowanceQuery.isLoading),
  }
}
