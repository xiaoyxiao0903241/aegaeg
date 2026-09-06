import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('calcAmountOutMin applies slippage in basis points', async () => {
  const { calcAmountOutMin } = await loadModule('/src/core/exchange/exchange-math.ts')

  assert.equal(calcAmountOutMin(10_000n, 50), 9_950n)
  assert.equal(calcAmountOutMin(100_000_000_000_000_000_000n, 100), 99_000_000_000_000_000_000n)
  assert.equal(calcAmountOutMin(1n, 9900), 1n)
})

test('calcAmountOutMin rejects invalid slippage', async () => {
  const { calcAmountOutMin } = await loadModule('/src/core/exchange/exchange-math.ts')

  assert.throws(() => calcAmountOutMin(100n, -1), /slippage/i)
  assert.throws(() => calcAmountOutMin(100n, 10_000), /slippage/i)
})

test('exchangeDeadline returns unix seconds in the future', async () => {
  const { exchangeDeadline } = await loadModule('/src/core/exchange/exchange-math.ts')
  const now = 1_700_000_000
  assert.equal(exchangeDeadline(20 * 60, now), 1_700_001_200)
})
