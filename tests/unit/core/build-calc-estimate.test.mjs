import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('buildCalcEstimate: stake 180d example maps profit/rate from computeCalcDay', async () => {
  const { buildCalcEstimate } = await loadModule('/src/core/staking/build-calc-estimate.ts')

  const stake = buildCalcEstimate({
    product: 'stake',
    period: '180',
    amount: '1000',
    price: '65',
    spotUsd: 65,
    days: 180,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.equal(stake.investedUsd, 65_000)
  assert.equal(stake.releasedUsd, 1000 * 65)
  assert.ok(Math.abs(stake.ratePct - (1.0041 ** 360 + 0.0041 * 360 * 0.1 - 1) * 100) < 1e-6)
  assert.ok(Math.abs(stake.profitUsd - (stake.sellUsd - stake.investedUsd)) < 1e-9)
  assert.ok(stake.breakEvenDay != null && stake.breakEvenDay <= 180)
  assert.equal(stake.fullReleaseDay, 180)
  assert.equal(stake.holdDay, 180)
})

test('buildCalcEstimate: bond cost is USD1 paid, principal is discounted AGX', async () => {
  const { buildCalcEstimate } = await loadModule('/src/core/staking/build-calc-estimate.ts')

  const bond = buildCalcEstimate({
    product: 'lpbond',
    period: '180',
    amount: '65000',
    price: '65',
    spotUsd: 65,
    days: 180,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
    discountRateBP: 8500,
  })
  assert.equal(bond.investedUsd, 65_000)
  assert.equal(bond.discountRateBP, 8500)
  assert.ok(Math.abs(bond.ratePct - (1.0041 ** 360 / 0.85 - 1) * 100) < 1e-6)
  assert.ok(Math.abs(bond.interestUsd - (bond.sellUsd - bond.releasedUsd)) < 1e-6)
})

test('buildCalcEstimate: missing epochsPerDay → zero rewards, cost still uses spot', async () => {
  const { buildCalcEstimate } = await loadModule('/src/core/staking/build-calc-estimate.ts')
  const stake = buildCalcEstimate({
    product: 'stake',
    period: 'liquid',
    amount: '1000',
    price: '65',
    spotUsd: 65,
    days: 10,
    epochRebasePct: 0.41,
  })
  assert.equal(stake.epochsPerDay, null)
  assert.equal(stake.interestUsd, 0)
  assert.equal(stake.investedUsd, 65_000)
})

test('buildCalcEstimate: stake investedUsd follows live spot not 65', async () => {
  const { buildCalcEstimate } = await loadModule('/src/core/staking/build-calc-estimate.ts')
  const stake = buildCalcEstimate({
    product: 'stake',
    period: 'liquid',
    amount: '1000',
    price: '80',
    spotUsd: 80,
    days: 1,
    epochRebasePct: 0,
    epochsPerDay: 2,
  })
  assert.equal(stake.investedUsd, 80_000)
  assert.equal(stake.spotUsd, 80)
  assert.equal(stake.profitUsd, 0)
})
