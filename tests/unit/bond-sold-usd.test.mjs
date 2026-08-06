import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('bondSoldUsd: missing deposit or price → null', async () => {
  const { bondSoldUsd } = await loadModule('/src/core/staking/bond-sold-usd.ts')
  assert.equal(bondSoldUsd(null, 65, 9), null)
  assert.equal(bondSoldUsd(1_000_000_000n, null, 9), null)
  assert.equal(bondSoldUsd(undefined, undefined, 9), null)
})

test('bondSoldUsd: totalDeposit × price', async () => {
  const { bondSoldUsd } = await loadModule('/src/core/staking/bond-sold-usd.ts')
  assert.equal(bondSoldUsd(2_000_000_000n, 65, 9), 130)
})

test('bondSoldUsd: zero deposit → 0', async () => {
  const { bondSoldUsd } = await loadModule('/src/core/staking/bond-sold-usd.ts')
  assert.equal(bondSoldUsd(0n, 65, 9), 0)
})
