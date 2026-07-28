import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { approveTokenIfNeeded, exchangeTokens } from '~/web3/exchange/exchange-write'
import type { ExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type TradeQuotedSubmitCore = {
  debouncedAmountIn: bigint
  setSubmitError: (error: unknown) => void
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: (live?: { sellBalance: bigint }) => Promise<bigint>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

/** Trade Pancake swap submit path (approve + swap + invalidate). Behavior-preserving extract. */
export async function submitMarketTrade(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  pair: ExchangePairTokens
  core: TradeQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<QueryObserverResult<{ sell: bigint }>> }
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
    const refreshed = await balancesQuery.refetch()
    if (refreshed.error || refreshed.data === undefined) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    const amountOutMin = await assertStillSubmittable({
      sellBalance: refreshed.data.sell,
    })

    await exchangeTokens({
      wallet,
      amountIn: core.debouncedAmountIn,
      tokenIn: pair.sell.address,
      tokenOut: pair.buy.address,
      amountOutMin,
    })
    invalidateAfterExchange()
    await balancesQuery.refetch()
  })
  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}
