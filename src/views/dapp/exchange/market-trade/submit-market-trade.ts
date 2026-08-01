import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { approveTokenIfNeeded, exchangeTokens } from '~/web3/exchange/exchange-write'
import type { ExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/quoted-submit-core'

/** Trade Pancake swap submit path (approve + swap + invalidate). Behavior-preserving extract. */
export async function submitMarketTrade(args: {
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  core: QuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { pair, path, core } = args

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session

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
