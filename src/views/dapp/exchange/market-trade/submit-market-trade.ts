import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type {
  ExchangePairTokens,
  ExchangeSubmitResult,
  QuotedSubmitCore,
} from '~/views/dapp/exchange/shared'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { approveTokenIfNeeded, exchangeTokens } from '~/web3/exchange/exchange-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'

/** 市价交易提交：经统一核授权后实时复核余额与报价，再路由兑换。 */
export async function submitMarketTrade(args: {
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  core: QuotedSubmitCore
}): Promise<ExchangeSubmitResult> {
  const { pair, path, core } = args

  // X 仅可卖：写路径 fail-closed，不依赖选币 UI
  if (pair.buy.key === 'x') {
    return { ok: false, error: new Error('TRADE_PATH_BUY_NOT_ALLOWED:x') }
  }

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session
    const amountIn = core.debouncedAmountIn

    type Snap = { sellBalance: bigint }

    await approveThenLiveWrite({
      readSnapshot: async (): Promise<Snap> => ({
        sellBalance: await readErc20Balance(pair.sell.address, address),
      }),
      evaluate: (snap) => (snap.sellBalance < amountIn ? 'insufficientBalance' : null),
      mapBlockError: (reason) => new Error(reason),
      softPreBlocks: [],
      approve: async () =>
        approveTokenIfNeeded({
          wallet,
          token: pair.sell.address,
          amountIn,
        }),
      write: async (live) => {
        const { amountOutMin } = await assertStillSubmittable({ sellBalance: live.sellBalance })
        await exchangeTokens({
          wallet,
          amountIn,
          path,
          amountOutMin,
        })
        invalidateAfterExchange()
      },
    })
  })
}
