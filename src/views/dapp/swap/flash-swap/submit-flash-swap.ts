import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { approveUsdtForFlashSwapIfNeeded, flashSwap } from '~/web3/swap/flash-swap-write'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type FlashQuotedSubmitCore = {
  debouncedAmountIn: bigint
  setSubmitError: (error: unknown) => void
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: () => Promise<bigint>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

/** Flash USDT→USD1 submit path (approve + swap + invalidate). Behavior-preserving extract. */
export async function submitFlashSwap(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  core: FlashQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<QueryObserverResult> }
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, core, balancesQuery } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    await approveUsdtForFlashSwapIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    await balancesQuery.refetch()
    const minUsd1Out = await assertStillSubmittable()

    await flashSwap({
      wallet,
      usdtAmount: core.debouncedAmountIn,
      minUsd1Out,
    })
    invalidateAfterSwap()
    await balancesQuery.refetch()
  })

  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}
