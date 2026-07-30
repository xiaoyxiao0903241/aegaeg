import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getExchangePairTokens maps direction to USD1 and AGX', async () => {
  const { getExchangePairTokens, getTradePairTokens, formatTradeRouteLabel } = await loadModule(
    '/src/views/dapp/exchange/exchange-pair.ts',
  )

  const forward = getExchangePairTokens('forward')
  assert.equal(forward.sell.symbol, 'USD1')
  assert.equal(forward.buy.symbol, 'AGX')

  const reverse = getExchangePairTokens('reverse')
  assert.equal(reverse.sell.symbol, 'AGX')
  assert.equal(reverse.buy.symbol, 'USD1')

  const xToUsd1 = getTradePairTokens('x', 'usd1')
  assert.equal(xToUsd1.sell.symbol, 'X')
  assert.equal(xToUsd1.buy.symbol, 'USD1')
  assert.equal(formatTradeRouteLabel('x', 'usd1'), 'X → AGX → USD1')
  assert.equal(formatTradeRouteLabel('x', 'agx'), 'X → AGX')
})
