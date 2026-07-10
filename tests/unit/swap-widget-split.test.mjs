import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('useSwapWidget assembles balances, spot rates, and quote core', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/swap/trade-swap/use-swap-widget.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /useSwapBalances/)
  assert.match(source, /useSwapSpotRates/)
  assert.match(source, /useSwapQuote/)
  assert.match(source, /submitTradeSwap/)
  assert.doesNotMatch(source, /queryKeys\.chain\.swapBalances/)
})

test('submitTradeSwap owns approve + swap + invalidate path', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/swap/trade-swap/submit-trade-swap.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /runQuotedSubmit/)
  assert.match(source, /approveTokenIfNeeded/)
  assert.match(source, /swapTokens/)
})

test('useSwapQuote keeps live re-gate after approve', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/swap/use-swap-quote.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /assertStillSubmittable/)
  assert.match(source, /staleTime:\s*0/)
  assert.match(source, /assertQuotedSwapStillSubmittable/)
})

test('useFlashSwapWidget assembles quote core and spot rates', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/swap/flash-swap/use-flash-swap-widget.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /useSwapQuote/)
  assert.match(source, /useFlashSwapSpotRates/)
  assert.match(source, /submitFlashSwap/)
  assert.doesNotMatch(source, /formatSwapRateColon/)
})
