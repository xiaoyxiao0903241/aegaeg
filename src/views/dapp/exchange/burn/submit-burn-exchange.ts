import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { resolveBurnContributionSwapGate } from '~/core/exchange/burn-contribution-swap-gates'
import {
  approveAgxForBurnExchangeIfNeeded,
  burnExchangeConvert,
} from '~/web3/exchange/burn-exchange-write'
import {
  readBurnContributionSwapConfig,
  readBurnExchangeBalances,
} from '~/web3/exchange/burn-exchange-read'
import { BURN_GATE_ERROR } from '~/web3/errors/exchange-write-gate-errors'
import { requireWriteSession } from '~/web3/wallet/require-write-session'

type BurnQuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: (helpers: {
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

  return core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    const { wallet, address } = requireWriteSession()

    await approveAgxForBurnExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })

    // L-tier: direct reads — not display-query refetch.
    const liveBalances = await readBurnExchangeBalances(address)
    await assertStillSubmittable({ sellBalance: liveBalances.sell })

    const liveConfig = await readBurnContributionSwapConfig()
    const gate = resolveBurnContributionSwapGate({
      amountIn: core.debouncedAmountIn,
      config: liveConfig,
    })
    if (gate) {
      throw new Error(BURN_GATE_ERROR[gate])
    }

    await burnExchangeConvert({
      wallet,
      agxAmount: core.debouncedAmountIn,
    })
    invalidateAfterExchange()
  })
}
