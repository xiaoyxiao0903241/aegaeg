import { evaluateBurnContributionSwap } from '~/core/exchange/burn-contribution-swap'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/quoted-submit-core'
import { BURN_BLOCKED } from '~/web3/errors/write-block-errors'
import {
  readBurnContributionSwapConfig,
  readBurnExchangeBalances,
} from '~/web3/exchange/burn-exchange-read'
import {
  approveAgxForBurnExchangeIfNeeded,
  burnExchangeConvert,
} from '~/web3/exchange/burn-exchange-write'

/** Burn AGX → contribution points: approve + convert + invalidate. */
export async function submitBurnExchange(args: {
  core: QuotedSubmitCore
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
