import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import { evaluateFlashUsd1Swap } from '~/core/exchange/flash-usd1-swap'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/quoted-submit-core'
import { FLASH_USD1_BLOCKED } from '~/web3/contract-error-message'
import { readFlashPairBalances, readUsd1SwapConfig } from '~/web3/exchange/flash-exchange-read'
import {
  approveAgxForWrapIfNeeded,
  approveUsdtForFlashExchangeIfNeeded,
  flashExchange,
  redeemGagxFlashExchange,
  wrapAgxFlashExchange,
} from '~/web3/exchange/flash-exchange-write'

/** Flash dual-pair submit: redeem / wrap / USDT swap + invalidate. */
export async function submitFlashExchange(args: {
  pairId: FlashPairId
  direction: ExchangeDirection
  core: QuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { pairId, direction, core } = args

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session

    if (pairId === 'usdt') {
      await approveUsdtForFlashExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    } else if (direction === 'reverse') {
      await approveAgxForWrapIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    }

    // L-tier: direct balance read — not display-query refetch.
    const liveBalances = await readFlashPairBalances(pairId, direction, address)
    const { amountOutMin: minOut, quotedOut } = await assertStillSubmittable({
      sellBalance: liveBalances.sell,
    })

    if (pairId === 'gagx') {
      if (direction === 'reverse') {
        await wrapAgxFlashExchange({
          wallet,
          agxAmount: core.debouncedAmountIn,
        })
      } else {
        await redeemGagxFlashExchange({
          wallet,
          gagxAmount: core.debouncedAmountIn,
        })
      }
    } else {
      const liveConfig = await readUsd1SwapConfig()
      const blockReason = evaluateFlashUsd1Swap({
        amountIn: core.debouncedAmountIn,
        quotedOut,
        config: liveConfig,
      })
      if (blockReason) {
        throw new Error(FLASH_USD1_BLOCKED[blockReason])
      }

      await flashExchange({
        wallet,
        usdtAmount: core.debouncedAmountIn,
        minUsd1Out: minOut,
      })
    }
    invalidateAfterExchange()
  })
}
