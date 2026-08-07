import type { QueryObserverResult } from '@tanstack/react-query'

import { ZERO_ADDRESS } from '~/core/constants'
import {
  evaluateTurbineClaimLive,
  evaluateTurbineUnlockLive,
} from '~/core/exchange/turbine-unlock-live'
import { invalidateAfterExchange, invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import { EXCHANGE_SUBMIT_BLOCKED } from '~/web3/contract-error-message'
import {
  readTurbineIsVested,
  readTurbineQuota,
  readTurbineSplitterManager,
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
 * Turbine 解锁：先读 liveUsd，按该金额授权并买入，再经 evaluateTurbineUnlockLive 闸门
 *
 * 禁止 approve(preUsd) 后 send(liveUsd)：价上行会导致授权不足 revert。
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

    let liveBalances = await readTurbineUsd1Balances(address)
    const [liveQuota, liveUsd] = await Promise.all([
      readTurbineQuota(address),
      readTurbineUsdQuote(unlockAmountAgx),
    ])

    // approve 后 live 重报价：价上行则补授权，再与 send 同额对齐
    if (liveUsd > liveBalances.approved) {
      await approveUsd1ForTurbineIfNeeded({ wallet, amountIn: liveUsd })
      liveBalances = await readTurbineUsd1Balances(address)
    }

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

    // 写前读分流器地址，决定成功后是否刷新释放缓存；读失败仍按进分流器处理
    let viaSplitter = true
    try {
      const splitterManager = await readTurbineSplitterManager(readClient)
      viaSplitter = Boolean(
        splitterManager && splitterManager.toLowerCase() !== ZERO_ADDRESS.toLowerCase(),
      )
    } catch {
      /* 保持默认按分流器处理 */
    }

    await claimCooledGagx({ wallet, index })
    invalidateAfterExchange()
    if (viaSplitter) invalidateAfterReleaseClaim()
    await refetchSilences()
  })
}
