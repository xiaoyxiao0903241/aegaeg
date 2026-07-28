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

export async function submitTurbineUnlock(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  core: TurbineSubmitCore
  usdAmount: bigint
  usd1Balance: bigint
  refetchBalances: () => Promise<QueryObserverResult>
  refetchQuota: () => Promise<QueryObserverResult>
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, core, usdAmount, usd1Balance, refetchBalances, refetchQuota } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }
  if (usdAmount <= 0n) {
    const error = new Error('TURBINE_ZERO_AMOUNT')
    core.setSubmitError(error)
    return { ok: false, error }
  }
  if (usdAmount > usd1Balance) {
    const error = new Error('TURBINE_INSUFFICIENT_USD1')
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runSubmit(async () => {
    await approveUsd1ForTurbineIfNeeded({ wallet, amountIn: usdAmount })
    await refetchBalances()
    await buyAgxAndStartCooldown({ wallet, usdAmount })
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
