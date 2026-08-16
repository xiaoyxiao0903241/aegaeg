import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('buildCalcEstimate: bond interestUsd is not × AGX price', async () => {
  const { buildCalcEstimate } = await loadModule('/src/core/staking/build-calc-estimate.ts')

  const bond = buildCalcEstimate({
    product: 'lpbond',
    period: '180',
    amount: '1000',
    price: '65',
    days: 1,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  const stake = buildCalcEstimate({
    product: 'stake',
    period: 'liquid',
    amount: '1000',
    price: '65',
    days: 1,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })

  assert.equal(bond.investedUsd, 1000)
  // 债券利息单位已是 USD1；若误乘 65 会系统性虚高。
  assert.ok(Math.abs(bond.interestUsd - bond.interestTokens) < 1e-9)
  assert.ok(bond.interestUsd < bond.interestTokens * 10)

  assert.equal(stake.investedUsd, 1000 * 65)
  assert.ok(Math.abs(stake.interestUsd - stake.interestTokens * 65) < 1e-6)
})

test('buildCalcEstimate: missing epochsPerDay → zero interest', async () => {
  const { buildCalcEstimate } = await loadModule('/src/core/staking/build-calc-estimate.ts')
  const stake = buildCalcEstimate({
    product: 'stake',
    period: 'liquid',
    amount: '1000',
    price: '65',
    days: 10,
    epochRebasePct: 0.41,
  })
  assert.equal(stake.epochsPerDay, null)
  assert.equal(stake.interestUsd, 0)
  assert.equal(stake.ratePct, 0)
})
