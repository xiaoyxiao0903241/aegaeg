import type { QueryObserverResult } from '@tanstack/react-query'
import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import {
  type FlashUsd1SwapConfig,
  resolveFlashUsd1SwapGate,
} from '~/core/exchange/flash-usd1-swap-gates'
import {
  approveAgxForWrapIfNeeded,
  approveUsdtForFlashExchangeIfNeeded,
  flashExchange,
  redeemGagxFlashExchange,
  wrapAgxFlashExchange,
} from '~/web3/exchange/flash-exchange-write'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

type FlashQuotedSubmitCore = {
  debouncedAmountIn: bigint
  setSubmitError: (error: unknown) => void
  runQuotedSubmit: (
    run: (helpers: {
      assertStillSubmittable: (live?: { sellBalance: bigint }) => Promise<bigint>
    }) => Promise<void>,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>
}

type FlashBalancesResult = { sell: bigint; buy: bigint; approved: bigint }

const FLASH_USD1_GATE_ERROR = {
  paused: 'FLASH_USD1_PAUSED',
  belowMin: 'FLASH_USD1_BELOW_MIN',
  aboveMax: 'FLASH_USD1_ABOVE_MAX',
  insufficientReserve: 'FLASH_USD1_INSUFFICIENT_RESERVE',
  zeroRate: 'FLASH_USD1_ZERO_RATE',
} as const

/** Flash dual-pair submit: redeem / wrap / USDT swap + invalidate. */
export async function submitFlashExchange(args: {
  pairId: FlashPairId
  direction: ExchangeDirection
  account: ActiveAccount
  wallet: ActiveWallet
  core: FlashQuotedSubmitCore
  balancesQuery: { refetch: () => Promise<QueryObserverResult<FlashBalancesResult>> }
  usd1Config: FlashUsd1SwapConfig | null
  refetchUsd1Config: () => Promise<QueryObserverResult<FlashUsd1SwapConfig>>
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { pairId, direction, account, wallet, core, balancesQuery, refetchUsd1Config } = args
  if (!account || !wallet) {
    const error = WALLET_GATE_ERROR.NOT_CONNECTED
    core.setSubmitError(error)
    return { ok: false, error }
  }

  const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
    if (pairId === 'usdt') {
      await approveUsdtForFlashExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    } else if (direction === 'reverse') {
      await approveAgxForWrapIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    }

    const refreshed = await balancesQuery.refetch()
    if (refreshed.error || refreshed.data === undefined) {
      throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
    }
    const minOut = await assertStillSubmittable({
      sellBalance: refreshed.data.sell,
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
      const liveConfig = await refetchUsd1Config()
      if (liveConfig.error || liveConfig.data === undefined) {
        throw new Error('EXCHANGE_SUBMIT_GATE_FAILED')
      }
      const gate = resolveFlashUsd1SwapGate({
        amountIn: core.debouncedAmountIn,
        quotedOut: minOut,
        config: liveConfig.data,
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
    await balancesQuery.refetch()
  })

  if (result.ok) return { ok: true }
  return { ok: false, error: result.error }
}

export { FLASH_USD1_GATE_ERROR }
