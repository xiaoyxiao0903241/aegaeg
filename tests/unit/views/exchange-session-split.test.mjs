import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('useMarketTradeSession assembles balances, spot rates, and quote core', async () => {
  const source = await readFile(
    new URL(
      '../../../src/views/dapp/exchange/market-trade/use-market-trade-session.ts',
      import.meta.url,
    ),
    'utf8',
  )

  assert.match(source, /useMarketTradeBalances/)
  assert.match(source, /useMarketTradeSpotRates/)
  assert.match(source, /useExchangeQuote/)
  assert.match(source, /submitMarketTrade/)
  assert.doesNotMatch(source, /queryKeys\.chain\.swapBalances/)
})

test('submitMarketTrade owns approve + live balance read + swap + invalidate path', async () => {
  const source = await readFile(
    new URL(
      '../../../src/views/dapp/exchange/market-trade/submit-market-trade.ts',
      import.meta.url,
    ),
    'utf8',
  )

  assert.match(source, /runQuotedSubmit/)
  assert.match(source, /approveTokenIfNeeded/)
  assert.match(source, /readErc20Balance/)
  assert.match(source, /assertStillSubmittable\(\{\s*sellBalance/)
  assert.match(source, /exchangeTokens/)
  assert.match(source, /invalidateAfterExchange/)
  assert.doesNotMatch(source, /balancesQuery\.refetch/)
})

test('useExchangeQuote keeps live re-check after approve', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/exchange/use-exchange-quote.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /assertStillSubmittable/)
  assert.match(source, /staleTime:\s*0/)
  assert.match(source, /assertQuotedExchangeStillSubmittable/)
  assert.match(source, /live\.sellBalance/)
})

test('useFlashExchangeSession assembles quote core and spot rates', async () => {
  const source = await readFile(
    new URL(
      '../../../src/views/dapp/exchange/flash-exchange/use-flash-exchange-session.ts',
      import.meta.url,
    ),
    'utf8',
  )

  assert.match(source, /useExchangeQuote/)
  assert.match(source, /useFlashExchangeSpotRates/)
  assert.match(source, /submitFlashExchange/)
  assert.doesNotMatch(source, /formatExchangeRateColon/)
})
