import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import {
  type BurnContributionSwapConfig,
  resolveBurnContributionSwapGate,
} from '~/core/exchange/burn-contribution-swap-gates'
import {
  approveAgxForBurnExchangeIfNeeded,
  burnExchangeConvert,
} from '~/web3/exchange/burn-exchange-write'
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

type BurnBalancesResult = { sell: bigint; approved: bigint }

/** Burn AGX → contribution points: approve + convert + invalidate. */
export async function submitBurnExchange(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  core: BurnQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<QueryObserverResult<BurnBalancesResult>> }
  config: BurnContributionSwapConfig | null
  refetchConfig: () => Promise<
    QueryObserverResult<BurnContributionSwapConfig & { agxToken: `0x${string}` }>
  >
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { account, wallet, core, balancesQuery, refetchConfig } = args

  return core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    if (!account || !wallet) {
      throw WALLET_GATE_ERROR.NOT_CONNECTED
    }

    await approveAgxForBurnExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })

    const refreshed = await balancesQuery.refetch()
    if (refreshed.error || refreshed.data === undefined) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    await assertStillSubmittable({ sellBalance: refreshed.data.sell })

    const liveConfig = await refetchConfig()
    if (liveConfig.error || liveConfig.data === undefined) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    const gate = resolveBurnContributionSwapGate({
      amountIn: core.debouncedAmountIn,
      config: liveConfig.data,
    })
    if (gate) {
      throw new Error(BURN_GATE_ERROR[gate])
    }

    await burnExchangeConvert({
      wallet,
      agxAmount: core.debouncedAmountIn,
    })
    invalidateAfterExchange()
    await balancesQuery.refetch()
  })
}
