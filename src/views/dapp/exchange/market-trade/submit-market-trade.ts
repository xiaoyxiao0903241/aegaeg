import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { ExchangePairTokens, QuotedSubmitCore } from '~/views/dapp/exchange/shared'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { approveTokenIfNeeded, exchangeTokens } from '~/web3/exchange/exchange-write'

/** 市价交易提交：授权 + 路由兑换 + 成功后失效相关缓存。 */
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
    // 直接读链上余额，而非依赖展示查询的刷新结果
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
