import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import {
  approveUsd1ForTurbineIfNeeded,
  buyAgxAndStartCooldown,
  claimCooledGagx,
} from '~/web3/exchange/turbine-exchange-write'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type TurbineSubmitCore = {
  setSubmitError: (error: unknown) => void
  runSubmit: (run: () => Promise<void>) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

/**
 * Turbine unlock — money-path: approve → live re-quote + balance/quota gate → buyAgxAndStartCooldown.
 */
export async function submitTurbineUnlock(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  core: TurbineSubmitCore
  /** Unlock AGX amount (handbook turbineBalances is AGX quota). */
  unlockAmountAgx: bigint
  refetchBalances: () => Promise<QueryObserverResult<{ usd1: bigint }>>
  refetchQuota: () => Promise<QueryObserverResult<bigint>>
  refetchUsdQuote: () => Promise<QueryObserverResult<bigint>>
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, core, unlockAmountAgx, refetchBalances, refetchQuota, refetchUsdQuote } =
    args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }
  if (unlockAmountAgx <= 0n) {
    const error = new Error('TURBINE_ZERO_AMOUNT')
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runSubmit(async () => {
    // Pre-approve quote (may drift during wallet signature).
    const preQuote = await refetchUsdQuote()
    if (preQuote.error || preQuote.data === undefined || preQuote.data <= 0n) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    const preUsd = preQuote.data

    await approveUsd1ForTurbineIfNeeded({ wallet, amountIn: preUsd })

    // Live re-gate after approve (money-path invariant 3).
    const [liveBalances, liveQuota, liveQuote] = await Promise.all([
      refetchBalances(),
      refetchQuota(),
      refetchUsdQuote(),
    ])
    if (
      liveBalances.error ||
      liveBalances.data === undefined ||
      liveQuota.error ||
      liveQuota.data === undefined ||
      liveQuote.error ||
      liveQuote.data === undefined
    ) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }

    const liveUsd = liveQuote.data
    if (liveUsd <= 0n) throw new Error('TURBINE_ZERO_AMOUNT')
    if (unlockAmountAgx > liveQuota.data) throw new Error('TURBINE_QUOTA_EXCEEDED')
    if (liveUsd > liveBalances.data.usd1) throw new Error('TURBINE_INSUFFICIENT_USD1')

    await buyAgxAndStartCooldown({ wallet, usdAmount: liveUsd })
    invalidateAfterExchange()
    await Promise.all([refetchBalances(), refetchQuota()])
  })
  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}

export async function submitTurbineClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  core: TurbineSubmitCore
  index: number
  refetchSilences: () => Promise<QueryObserverResult>
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, core, index, refetchSilences } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runSubmit(async () => {
    await claimCooledGagx({ wallet, index })
    invalidateAfterExchange()
    // Handbook §16.5: claim uses swap-and-pop — must re-fetch the whole list.
    await refetchSilences()
  })
  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}
