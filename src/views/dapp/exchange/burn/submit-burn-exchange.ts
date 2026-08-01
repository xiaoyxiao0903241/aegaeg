import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { evaluateBurnContributionSwap } from '~/core/exchange/burn-contribution-swap'
import {
  approveAgxForBurnExchangeIfNeeded,
  burnExchangeConvert,
} from '~/web3/exchange/burn-exchange-write'
import {
  readBurnContributionSwapConfig,
  readBurnExchangeBalances,
} from '~/web3/exchange/burn-exchange-read'
import { BURN_BLOCKED } from '~/web3/errors/write-block-errors'
import type { WriteSession } from '~/web3/wallet/require-write-session'

type BurnQuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: (helpers: {
      session: WriteSession
      assertStillSubmittable: (live?: {
        sellBalance: bigint
      }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}

/** Burn AGX → contribution points: approve + convert + invalidate. */
export async function submitBurnExchange(args: {
  core: BurnQuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core } = args

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session

    await approveAgxForBurnExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })

    // L-tier: direct reads — not display-query refetch.
    const liveBalances = await readBurnExchangeBalances(address)
    await assertStillSubmittable({ sellBalance: liveBalances.sell })

    const liveConfig = await readBurnContributionSwapConfig()
    const blockReason = evaluateBurnContributionSwap({
      amountIn: core.debouncedAmountIn,
      config: liveConfig,
    })
    if (blockReason) {
      throw new Error(BURN_BLOCKED[blockReason])
    }

    await burnExchangeConvert({
      wallet,
      agxAmount: core.debouncedAmountIn,
    })
    invalidateAfterExchange()
  })
}
