import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('submitMarketTrade must not refetch stale balance cache as live authority', async () => {
  const source = await readFile(
    new URL(
      '../../../src/views/dapp/exchange/market-trade/submit-market-trade.ts',
      import.meta.url,
    ),
    'utf8',
  )
  assert.doesNotMatch(source, /balancesQuery\.refetch/)
})

test('submitFlashExchange must not reuse stale USDT config after approve', async () => {
  const source = await readFile(
    new URL(
      '../../../src/views/dapp/exchange/flash-exchange/submit-flash-exchange.ts',
      import.meta.url,
    ),
    'utf8',
  )
  // Anti-regression: never fall back to a captured pre-approve config.
  assert.doesNotMatch(source, /liveConfig \?\? \(await readUsd1SwapConfig/)
})

test('market-trade session must not use retired swapBalances query key', async () => {
  const source = await readFile(
    new URL(
      '../../../src/views/dapp/exchange/market-trade/use-market-trade-session.ts',
      import.meta.url,
    ),
    'utf8',
  )
  assert.doesNotMatch(source, /queryKeys\.chain\.swapBalances/)
})
