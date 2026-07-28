import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('flash Usd1Swap gates: paused / min / max / reserve / zero rate', async () => {
  const { resolveFlashUsd1SwapGate } = await loadModule(
    '/src/core/exchange/flash-usd1-swap-gates.ts',
  )

  const base = {
    rateBps: 10_000n,
    usdtDec: 18,
    usd1Dec: 18,
    isPaused: false,
    minIn: 0n,
    maxIn: 0n,
    reserve: 1_000n,
  }

  assert.equal(
    resolveFlashUsd1SwapGate({ amountIn: 1n, quotedOut: 1n, config: { ...base, isPaused: true } }),
    'paused',
  )
  assert.equal(
    resolveFlashUsd1SwapGate({
      amountIn: 5n,
      quotedOut: 5n,
      config: { ...base, minIn: 10n },
    }),
    'belowMin',
  )
  assert.equal(
    resolveFlashUsd1SwapGate({
      amountIn: 20n,
      quotedOut: 20n,
      config: { ...base, maxIn: 10n },
    }),
    'aboveMax',
  )
  assert.equal(
    resolveFlashUsd1SwapGate({
      amountIn: 1n,
      quotedOut: 2_000n,
      config: { ...base, reserve: 1_000n },
    }),
    'insufficientReserve',
  )
  assert.equal(
    resolveFlashUsd1SwapGate({
      amountIn: 1n,
      quotedOut: 1n,
      config: { ...base, rateBps: 0n },
    }),
    'zeroRate',
  )
  assert.equal(resolveFlashUsd1SwapGate({ amountIn: 1n, quotedOut: 1n, config: base }), null)
})
