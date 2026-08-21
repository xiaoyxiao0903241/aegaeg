import type { QueryObserverResult } from '@tanstack/react-query'

import { ZERO_ADDRESS } from '~/core/constants'
import {
  calcTurbinePayableUsd,
  evaluateTurbineClaimLive,
  evaluateTurbineUnlockLive,
} from '~/core/exchange/turbine-unlock-live'
import { invalidateAfterExchange, invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import type { ExchangeSubmitResult } from '~/views/dapp/exchange/shared'
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
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

type TurbineSubmitCore = {
  runSubmit: (run: (session: WriteSession) => Promise<void>) => Promise<ExchangeSubmitResult>
}

/**
 * Turbine 解锁：经统一核预检 → 按需授权 → 实时复核 → 买入
 *
 * 授权与提交均为 min(报价×(1+滑点), 全配额报价)；授权后实时再报价加码截顶，升高则硬挡。
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function submitTurbineUnlock(args: {
  core: TurbineSubmitCore
  /** 本次解锁的 AGX 数量（以链上 turbineBalances 为准）。 */
  unlockAmountAgx: bigint
  /** 用户滑点（BPS）；应付 = min(quote×(1+滑点), 全配额报价)。 */
  slippageBps: number
}): Promise<ExchangeSubmitResult> {
  const { core, unlockAmountAgx, slippageBps } = args

  return core.runSubmit(async (session) => {
    const { wallet, address, readClient } = session
    if (unlockAmountAgx <= 0n) {
      throw new Error('TURBINE_ZERO_AMOUNT')
    }

    type Snap = {
      liveUsd: bigint
      liveQuota: bigint
      usd1: bigint
      approved: bigint
    }

    let grantedUsd = 0n
    let quotedUsd = 0n

    await approveThenLiveWrite({
      readSnapshot: async (): Promise<Snap> => {
        const [liveBalances, liveQuota] = await Promise.all([
          readTurbineUsd1Balances(address, readClient),
          readTurbineQuota(address, readClient),
        ])
        const quotedUnlockP = readTurbineUsdQuote(unlockAmountAgx, readClient)
        const quotedQuotaP =
          liveQuota > 0n && unlockAmountAgx !== liveQuota
            ? readTurbineUsdQuote(liveQuota, readClient)
            : quotedUnlockP
        const [quotedUnlock, quotedQuota] = await Promise.all([quotedUnlockP, quotedQuotaP])
        const liveUsd = calcTurbinePayableUsd(quotedUnlock, quotedQuota, slippageBps)
        if (quotedUsd === 0n) quotedUsd = liveUsd
        return {
          liveUsd,
          liveQuota,
          usd1: liveBalances.usd1,
          approved: liveBalances.approved,
        }
      },
      evaluate: (snap) =>
        evaluateTurbineUnlockLive({
          unlockAmountAgx,
          liveUsd: snap.liveUsd,
          liveQuota: snap.liveQuota,
          usd1: snap.usd1,
          approved: snap.approved,
          grantedUsd,
        }),
      mapBlockError: (reason) => new Error(reason),
      softPreBlocks: ['TURBINE_INSUFFICIENT_ALLOWANCE'],
      approve: async () => {
        const mined = await approveUsd1ForTurbineIfNeeded({ wallet, amountIn: quotedUsd })
        if (mined) grantedUsd = quotedUsd
        return mined
      },
      write: async (live) => {
        await buyAgxAndStartCooldown({ wallet, usdAmount: live.liveUsd })
        invalidateAfterExchange()
      },
    })
  })
}

/**
 * Turbine 领取：经统一核实时确认已解锁后再写
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function submitTurbineClaim(args: {
  core: TurbineSubmitCore
  index: number
  refetchSilences: () => Promise<QueryObserverResult>
}): Promise<ExchangeSubmitResult> {
  const { core, index, refetchSilences } = args

  return core.runSubmit(async (session) => {
    const { wallet, address, readClient } = session

    await approveThenLiveWrite({
      readSnapshot: async () => ({
        vested: await readTurbineIsVested(address, index, readClient),
      }),
      evaluate: (snap) => evaluateTurbineClaimLive(snap.vested),
      mapBlockError: (reason) => new Error(reason),
      write: async () => {
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
      },
    })
  })
}
