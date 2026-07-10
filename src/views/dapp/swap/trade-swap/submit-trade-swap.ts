import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { approveTokenIfNeeded, swapTokens } from '~/web3/swap/swap-write'
import type { SwapPairTokens } from '~/views/dapp/swap/swap-pair'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type TradeQuotedSubmitCore = {
  debouncedAmountIn: bigint
  setSubmitError: (error: unknown) => void
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: () => Promise<bigint>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

/** Trade Pancake swap submit path (approve + swap + invalidate). Behavior-preserving extract. */
export async function submitTradeSwap(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  pair: SwapPairTokens
  core: TradeQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<QueryObserverResult> }
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { account, wallet, pair, core, balancesQuery } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    await approveTokenIfNeeded({
      wallet,
      token: pair.sell.address,
      amountIn: core.debouncedAmountIn,
    })
    await balancesQuery.refetch()
    const amountOutMin = await assertStillSubmittable()

    await swapTokens({
      wallet,
      amountIn: core.debouncedAmountIn,
      tokenIn: pair.sell.address,
      tokenOut: pair.buy.address,
      amountOutMin,
    })
    invalidateAfterSwap()
    await balancesQuery.refetch()
  })
  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}
