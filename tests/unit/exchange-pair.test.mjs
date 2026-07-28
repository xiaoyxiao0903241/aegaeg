import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getExchangePairTokens maps direction to USD1 and USDT', async () => {
  const { getExchangePairTokens } = await loadModule('/src/views/dapp/exchange/exchange-pair.ts')

  const forward = getExchangePairTokens('forward')
  assert.equal(forward.sell.symbol, 'USD1')
  assert.equal(forward.buy.symbol, 'USDT')

  const reverse = getExchangePairTokens('reverse')
  assert.equal(reverse.sell.symbol, 'USDT')
  assert.equal(reverse.buy.symbol, 'USD1')
})
