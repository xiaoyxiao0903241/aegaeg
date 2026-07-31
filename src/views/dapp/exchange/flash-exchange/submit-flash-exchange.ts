import { FLASH_USD1_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import { resolveFlashUsd1SwapGate } from '~/core/exchange/flash-usd1-swap-gates'
import {
  approveAgxForWrapIfNeeded,
  approveUsdtForFlashExchangeIfNeeded,
  flashExchange,
  redeemGagxFlashExchange,
  wrapAgxFlashExchange,
} from '~/web3/exchange/flash-exchange-write'
import { readFlashPairBalances, readUsd1SwapConfig } from '~/web3/exchange/flash-exchange-read'
import { requireWriteSession } from '~/web3/wallet/require-write-session'

type FlashQuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: (live?: {
        sellBalance: bigint
      }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}

/** Flash dual-pair submit: redeem / wrap / USDT swap + invalidate. */
export async function submitFlashExchange(args: {
  pairId: FlashPairId
  direction: ExchangeDirection
  core: FlashQuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { pairId, direction, core } = args

  return core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    const { wallet, address } = requireWriteSession()

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
      const gate = resolveFlashUsd1SwapGate({
        amountIn: core.debouncedAmountIn,
        quotedOut,
        config: liveConfig,
      })
      if (gate) {
        throw new Error(FLASH_USD1_GATE_ERROR[gate])
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

export { FLASH_USD1_GATE_ERROR }
