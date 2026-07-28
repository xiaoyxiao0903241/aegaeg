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

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type BurnQuotedSubmitCore = {
  debouncedAmountIn: bigint
  setSubmitError: (error: unknown) => void
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: (live?: {
        sellBalance: bigint
      }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

type BurnBalancesResult = { sell: bigint; approved: bigint }

const BURN_GATE_ERROR = {
  paused: 'BURN_CONTRIBUTION_PAUSED',
  belowMin: 'BURN_CONTRIBUTION_BELOW_MIN',
  aboveMax: 'BURN_CONTRIBUTION_ABOVE_MAX',
  zeroRate: 'BURN_CONTRIBUTION_ZERO_RATE',
} as const

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
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, core, balancesQuery, refetchConfig } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
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

  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}

export { BURN_GATE_ERROR }
