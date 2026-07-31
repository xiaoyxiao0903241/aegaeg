import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { approveTokenIfNeeded, exchangeTokens } from '~/web3/exchange/exchange-write'
import type { ExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type TradeQuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: (live?: {
        sellBalance: bigint
      }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}

/** Trade Pancake swap submit path (approve + swap + invalidate). Behavior-preserving extract. */
export async function submitMarketTrade(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  core: TradeQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<{ data?: { sell: bigint }; error: Error | null }> }
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { account, wallet, pair, path, core, balancesQuery } = args

  return core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    if (!account || !wallet) {
      throw WALLET_GATE_ERROR.NOT_CONNECTED
    }

    await approveTokenIfNeeded({
      wallet,
      token: pair.sell.address,
      amountIn: core.debouncedAmountIn,
    })
    const refreshed = await balancesQuery.refetch()
    if (refreshed.error || refreshed.data === undefined) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    const { amountOutMin } = await assertStillSubmittable({
      sellBalance: refreshed.data.sell,
    })

    await exchangeTokens({
      wallet,
      amountIn: core.debouncedAmountIn,
      path,
      amountOutMin,
    })
    invalidateAfterExchange()
    await balancesQuery.refetch()
  })
}
