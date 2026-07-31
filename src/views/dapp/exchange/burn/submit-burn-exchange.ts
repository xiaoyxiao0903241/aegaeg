import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
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

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

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
  account: ActiveAccount
  wallet: ActiveWallet
  core: BurnQuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { account, wallet, core } = args

  return core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    if (!account || !wallet) {
      throw WALLET_GATE_ERROR.NOT_CONNECTED
    }

    await approveAgxForBurnExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })

    // L-tier: direct reads — not display-query refetch.
    const liveBalances = await readBurnExchangeBalances(account.address)
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
