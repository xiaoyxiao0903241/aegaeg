import { EXCHANGE_SUBMIT_BLOCKED } from '~/web3/contract-error-message'
import type { QueryObserverResult } from '@tanstack/react-query'
import { evaluateTurbineUnlockLive } from '~/core/exchange/turbine-live-gate'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import {
  readTurbineIsVested,
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

/** Turbine 解锁：approve → live 重读报价/余额/授权/配额 → buyAgxAndStartCooldown。 */
export async function submitTurbineUnlock(args: {
  core: TurbineSubmitCore
  /** 解锁 AGX 配额（手册 turbineBalances）。 */
  unlockAmountAgx: bigint
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core, unlockAmountAgx } = args

  return core.runSubmit(async (session) => {
    const { wallet, address } = session
    if (unlockAmountAgx <= 0n) {
      throw new Error('TURBINE_ZERO_AMOUNT')
    }

    const preUsd = await readTurbineUsdQuote(unlockAmountAgx)
    if (preUsd <= 0n) {
      throw new Error(EXCHANGE_SUBMIT_BLOCKED)
    }

    await approveUsd1ForTurbineIfNeeded({ wallet, amountIn: preUsd })

    const [liveBalances, liveQuota, liveUsd] = await Promise.all([
      readTurbineUsd1Balances(address),
      readTurbineQuota(address),
      readTurbineUsdQuote(unlockAmountAgx),
    ])

    const blocked = evaluateTurbineUnlockLive({
      unlockAmountAgx,
      liveUsd,
      liveQuota,
      usd1: liveBalances.usd1,
      approved: liveBalances.approved,
    })
    if (blocked) throw new Error(blocked)

    await buyAgxAndStartCooldown({ wallet, usdAmount: liveUsd })
    invalidateAfterExchange()
  })
}

/** Turbine claim：live `isVested` 通过后再写；成功后整表 refetch（swap-and-pop）。 */
export async function submitTurbineClaim(args: {
  core: TurbineSubmitCore
  index: number
  refetchSilences: () => Promise<QueryObserverResult>
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core, index, refetchSilences } = args

  return core.runSubmit(async (session) => {
    const { wallet, address, readClient } = session
    const vested = await readTurbineIsVested(address, index, readClient)
    if (!vested) throw new Error('TURBINE_NOT_VESTED')

    await claimCooledGagx({ wallet, index })
    invalidateAfterExchange()
    await refetchSilences()
  })
}
