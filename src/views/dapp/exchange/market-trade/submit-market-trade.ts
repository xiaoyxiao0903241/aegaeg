import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { approveTokenIfNeeded, exchangeTokens } from '~/web3/exchange/exchange-write'
import type { ExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'
import { requireWriteSession } from '~/web3/wallet/require-write-session'

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
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  core: TradeQuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { pair, path, core } = args

  return core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    const { wallet, address } = requireWriteSession()

    await approveTokenIfNeeded({
      wallet,
      token: pair.sell.address,
      amountIn: core.debouncedAmountIn,
    })
    // L-tier: direct read — do not trust display query refetch.
    const sellBalance = await readErc20Balance(pair.sell.address, address)
    const { amountOutMin } = await assertStillSubmittable({ sellBalance })

    await exchangeTokens({
      wallet,
      amountIn: core.debouncedAmountIn,
      path,
      amountOutMin,
    })
    invalidateAfterExchange()
  })
}
