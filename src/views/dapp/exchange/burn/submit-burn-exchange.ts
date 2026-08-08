import { evaluateBurnContributionSwap } from '~/core/exchange/burn-contribution-swap'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/shared'
import { BURN_BLOCKED } from '~/web3/errors/write-block-errors'
import {
  readBurnContributionSwapConfig,
  readBurnExchangeBalances,
} from '~/web3/exchange/burn-exchange-read'
import {
  approveAgxForBurnExchangeIfNeeded,
  burnExchangeConvert,
} from '~/web3/exchange/burn-exchange-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'

/**
 * 销毁 AGX 换贡献点：经统一核授权后实时复核余额与配置，再转换
 *
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export async function submitBurnExchange(args: {
  core: QuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core } = args

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session
    const amountIn = core.debouncedAmountIn

    type Snap = {
      sellBalance: bigint
      config: Awaited<ReturnType<typeof readBurnContributionSwapConfig>>
    }

    await approveThenLiveWrite({
      readSnapshot: async (): Promise<Snap> => {
        const [liveBalances, liveConfig] = await Promise.all([
          readBurnExchangeBalances(address),
          readBurnContributionSwapConfig(),
        ])
        return { sellBalance: liveBalances.sell, config: liveConfig }
      },
      evaluate: (snap) => {
        if (snap.sellBalance < amountIn) return 'insufficientBalance' as const
        return evaluateBurnContributionSwap({ amountIn, config: snap.config })
      },
      mapBlockError: (reason) => {
        if (reason === 'insufficientBalance') return new Error(reason)
        return new Error(BURN_BLOCKED[reason])
      },
      softPreBlocks: [],
      approve: async () => {
        await approveAgxForBurnExchangeIfNeeded({ wallet, amountIn })
      },
      write: async (live) => {
        await assertStillSubmittable({ sellBalance: live.sellBalance })
        await burnExchangeConvert({
          wallet,
          agxAmount: amountIn,
        })
        invalidateAfterExchange()
      },
    })
  })
}
