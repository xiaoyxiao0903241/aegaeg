import type { QueryObserverResult } from '@tanstack/react-query'

import {
  evaluateTurbineClaimLive,
  evaluateTurbineUnlockLive,
} from '~/core/exchange/turbine-unlock-live'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import { EXCHANGE_SUBMIT_BLOCKED } from '~/web3/contract-error-message'
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

/**
 * Turbine 解锁：授权后实时重读报价 / 余额 / 授权 / 配额，再买入 AGX 并进入冷却
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function submitTurbineUnlock(args: {
  core: TurbineSubmitCore
  /** 本次解锁的 AGX 数量（以链上 turbineBalances 为准）。 */
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

/**
 * Turbine 领取：先实时确认已解锁，写入成功后整表刷新
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function submitTurbineClaim(args: {
  core: TurbineSubmitCore
  index: number
  refetchSilences: () => Promise<QueryObserverResult>
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core, index, refetchSilences } = args

  return core.runSubmit(async (session) => {
    const { wallet, address, readClient } = session
    const vested = await readTurbineIsVested(address, index, readClient)
    const blocked = evaluateTurbineClaimLive(vested)
    if (blocked) throw new Error(blocked)

    await claimCooledGagx({ wallet, index })
    invalidateAfterExchange()
    await refetchSilences()
  })
}
