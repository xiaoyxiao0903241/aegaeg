import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('getTradePairTokens maps trade keys and multi-hop routes', async () => {
  const { getTradePairTokens, formatTradeRouteLabel } = await loadModule(
    '/src/views/dapp/exchange/shared.ts',
  )

  const forward = getTradePairTokens('usd1', 'agx')
  assert.equal(forward.sell.symbol, 'USD1')
  assert.equal(forward.buy.symbol, 'AGX')

  const reverse = getTradePairTokens('agx', 'usd1')
  assert.equal(reverse.sell.symbol, 'AGX')
  assert.equal(reverse.buy.symbol, 'USD1')

  const xToUsd1 = getTradePairTokens('x', 'usd1')
  assert.equal(xToUsd1.sell.symbol, 'X')
  assert.equal(xToUsd1.buy.symbol, 'USD1')
  assert.equal(formatTradeRouteLabel('x', 'usd1'), 'X → AGX → USD1')
  assert.equal(formatTradeRouteLabel('x', 'agx'), 'X → AGX')
})
