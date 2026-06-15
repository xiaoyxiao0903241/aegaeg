import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getSwapPairTokens maps direction to USD1 and USDT', async () => {
  const { getSwapPairTokens } = await loadModule('/src/lib/swap/swap-pair.ts')

  const forward = getSwapPairTokens('forward')
  assert.equal(forward.sell.symbol, 'USD1')
  assert.equal(forward.buy.symbol, 'USDT')

  const reverse = getSwapPairTokens('reverse')
  assert.equal(reverse.sell.symbol, 'USDT')
  assert.equal(reverse.buy.symbol, 'USD1')
})
