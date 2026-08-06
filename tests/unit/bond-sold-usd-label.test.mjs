import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('bondSoldUsdAmount: missing deposit or price → null', async () => {
  const { bondSoldUsdAmount } = await loadModule('/src/core/staking/format-bond-sold-usd.ts')
  assert.equal(bondSoldUsdAmount(null, 65, 9), null)
  assert.equal(bondSoldUsdAmount(1_000_000_000n, null, 9), null)
  assert.equal(bondSoldUsdAmount(undefined, undefined, 9), null)
})

test('bondSoldUsdAmount: totalDeposit × price', async () => {
  const { bondSoldUsdAmount } = await loadModule('/src/core/staking/format-bond-sold-usd.ts')
  assert.equal(bondSoldUsdAmount(2_000_000_000n, 65, 9), 130)
})

test('bondSoldUsdAmount: zero deposit → 0', async () => {
  const { bondSoldUsdAmount } = await loadModule('/src/core/staking/format-bond-sold-usd.ts')
  assert.equal(bondSoldUsdAmount(0n, 65, 9), 0)
})
