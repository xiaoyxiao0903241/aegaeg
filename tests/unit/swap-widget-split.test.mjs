import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('useSwapWidget assembles balances, spot rates, and quote core', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/swap/use-swap-widget.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /useSwapBalances/)
  assert.match(source, /useSwapSpotRates/)
  assert.match(source, /useSwapQuote/)
  assert.match(source, /runQuotedSubmit/)
  assert.doesNotMatch(source, /queryKeys\.chain\.swapBalances/)
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
