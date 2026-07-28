import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import {
  approveUsdtForFlashExchangeIfNeeded,
  flashExchange,
} from '~/web3/exchange/flash-exchange-write'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type FlashQuotedSubmitCore = {
  debouncedAmountIn: bigint
  setSubmitError: (error: unknown) => void
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: (live?: { sellBalance: bigint }) => Promise<bigint>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

/** Flash USDT→USD1 submit path (approve + swap + invalidate). Behavior-preserving extract. */
export async function submitFlashExchange(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  core: FlashQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<QueryObserverResult<{ usdt: bigint }>> }
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, core, balancesQuery } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    await approveUsdtForFlashExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    const refreshed = await balancesQuery.refetch()
    if (refreshed.error || refreshed.data === undefined) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    const minUsd1Out = await assertStillSubmittable({
      sellBalance: refreshed.data.usdt,
    })

    await flashExchange({
      wallet,
      usdtAmount: core.debouncedAmountIn,
      minUsd1Out,
    })
    invalidateAfterExchange()
    await balancesQuery.refetch()
  })

  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}
