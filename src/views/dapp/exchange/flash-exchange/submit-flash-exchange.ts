import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import { evaluateFlashUsd1Swap } from '~/core/exchange/flash-usd1-swap'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/shared'
import { FLASH_USD1_BLOCKED } from '~/web3/contract-error-message'
import { readFlashPairBalances, readUsd1SwapConfig } from '~/web3/exchange/flash-exchange-read'
import {
  approveAgxForWrapIfNeeded,
  approveUsdtForFlashExchangeIfNeeded,
  flashExchange,
  redeemGagxFlashExchange,
  wrapAgxFlashExchange,
} from '~/web3/exchange/flash-exchange-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'

/**
 * 闪电兑换提交：经统一核授权后实时复核，再兑换；成功后失效相关缓存
 *
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export async function submitFlashExchange(args: {
  pairId: FlashPairId
  direction: ExchangeDirection
  core: QuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { pairId, direction, core } = args
  const amountIn = core.debouncedAmountIn

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address, readClient } = session

    if (pairId === 'gagx') {
      type GagxSnap = { sellBalance: bigint }
      const readGagx = async (): Promise<GagxSnap> => {
        const liveBalances = await readFlashPairBalances(pairId, direction, address, readClient)
        return { sellBalance: liveBalances.sell }
      }
      const evaluateGagx = (snap: GagxSnap) =>
        snap.sellBalance < amountIn ? ('insufficientBalance' as const) : null
      const writeGagx = async (live: GagxSnap) => {
        await assertStillSubmittable({ sellBalance: live.sellBalance })
        if (direction === 'reverse') {
          await wrapAgxFlashExchange({ wallet, agxAmount: amountIn })
        } else {
          await redeemGagxFlashExchange({ wallet, gagxAmount: amountIn })
        }
        invalidateAfterExchange()
      }

      if (direction === 'reverse') {
        await approveThenLiveWrite({
          readSnapshot: readGagx,
          evaluate: evaluateGagx,
          mapBlockError: (reason) => new Error(reason),
          softPreBlocks: [],
          approve: async () => approveAgxForWrapIfNeeded({ wallet, amountIn }),
          write: writeGagx,
        })
      } else {
        await approveThenLiveWrite({
          readSnapshot: readGagx,
          evaluate: evaluateGagx,
          mapBlockError: (reason) => new Error(reason),
          write: writeGagx,
        })
      }
      return
    }

    type UsdtSnap = {
      sellBalance: bigint
      config: Awaited<ReturnType<typeof readUsd1SwapConfig>>
      quotedOut: bigint
      minOut: bigint
    }

    await approveThenLiveWrite({
      readSnapshot: async (): Promise<UsdtSnap> => {
        const config = await readUsd1SwapConfig(readClient)
        const liveBalances = await readFlashPairBalances(pairId, direction, address, readClient)
        const still = await assertStillSubmittable({ sellBalance: liveBalances.sell })
        return {
          sellBalance: liveBalances.sell,
          config,
          quotedOut: still.quotedOut,
          minOut: still.amountOutMin,
        }
      },
      evaluate: (snap) => {
        if (snap.sellBalance < amountIn) return 'insufficientBalance' as const
        return evaluateFlashUsd1Swap({
          amountIn,
          quotedOut: snap.quotedOut,
          config: snap.config,
        })
      },
      mapBlockError: (reason) => {
        if (reason === 'insufficientBalance') return new Error(reason)
        return new Error(FLASH_USD1_BLOCKED[reason])
      },
      softPreBlocks: [],
      approve: async () => {
        const config = await readUsd1SwapConfig(readClient)
        return approveUsdtForFlashExchangeIfNeeded({
          wallet,
          amountIn,
          usdtToken: config.usdtToken,
        })
      },
      write: async (live) => {
        await flashExchange({
          wallet,
          usdtAmount: amountIn,
          minUsd1Out: live.minOut,
        })
        invalidateAfterExchange()
      },
    })
  })
}
