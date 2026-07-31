import type { QueryObserverResult } from '@tanstack/react-query'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import {
  readTurbineQuota,
  readTurbineUsd1Balances,
  readTurbineUsdQuote,
} from '~/web3/exchange/turbine-exchange-read'
import {
  approveUsd1ForTurbineIfNeeded,
  buyAgxAndStartCooldown,
  claimCooledGagx,
} from '~/web3/exchange/turbine-exchange-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

type TurbineSubmitCore = {
  runSubmit: (
    run: (session: WriteSession) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}

/**
 * Turbine unlock — money-path: approve → live re-quote + balance/quota gate → buyAgxAndStartCooldown.
 * L-tier gates use direct `readTurbine*` (not display-query refetch).
 */
export async function submitTurbineUnlock(args: {
  core: TurbineSubmitCore
  /** Unlock AGX amount (handbook turbineBalances is AGX quota). */
  unlockAmountAgx: bigint
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core, unlockAmountAgx } = args

  return core.runSubmit(async (session) => {
    const { wallet, address } = session
    if (unlockAmountAgx <= 0n) {
      throw new Error('TURBINE_ZERO_AMOUNT')
    }

    // Pre-approve quote (may drift during wallet signature).
    const preUsd = await readTurbineUsdQuote(unlockAmountAgx)
    if (preUsd <= 0n) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }

    await approveUsd1ForTurbineIfNeeded({ wallet, amountIn: preUsd })

    // Live re-gate after approve (money-path invariant 3) — direct reads, staleTime 0 semantics.
    const [liveBalances, liveQuota, liveUsd] = await Promise.all([
      readTurbineUsd1Balances(address),
      readTurbineQuota(address),
      readTurbineUsdQuote(unlockAmountAgx),
    ])

    if (liveUsd <= 0n) throw new Error('TURBINE_ZERO_AMOUNT')
    if (unlockAmountAgx > liveQuota) throw new Error('TURBINE_QUOTA_EXCEEDED')
    if (liveUsd > liveBalances.usd1) throw new Error('TURBINE_INSUFFICIENT_USD1')

    await buyAgxAndStartCooldown({ wallet, usdAmount: liveUsd })
    invalidateAfterExchange()
  })
}

export async function submitTurbineClaim(args: {
  core: TurbineSubmitCore
  index: number
  refetchSilences: () => Promise<QueryObserverResult>
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core, index, refetchSilences } = args

  return core.runSubmit(async (session) => {
    const { wallet } = session

    await claimCooledGagx({ wallet, index })
    invalidateAfterExchange()
    // Handbook §16.5: claim uses swap-and-pop — must re-fetch the whole list.
    await refetchSilences()
  })
}
