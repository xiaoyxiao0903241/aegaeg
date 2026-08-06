import assert from 'node:assert/strict'
import test from 'node:test'

import {
  baseDailyPctFromEpoch,
  buildCalcYieldCurvePoints,
  CALC_MAX_DAYS,
  calcLocalInterest,
  compoundInterest,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  lockedBonusInterest,
  periodYieldPct,
  stakePeriodDays,
} from '../../../src/core/staking/staking-yield-display.ts'

test('lockedBonusBps matches RewardManager handbook defaults', () => {
  assert.equal(lockedBonusBps('liquid'), 0)
  assert.equal(lockedBonusBps('180'), 1000)
  assert.equal(lockedBonusBps('360'), 1500)
  assert.equal(lockedBonusBps('540'), 2000)
  assert.equal(lockedBonusBps('unknown'), 0)
})

test('epochRebasePctFrom1e18 + baseDailyPctFromEpoch = 2× rebase', () => {
  // 0.41% stored as 0.41 * 1e18
  const rate = 410000000000000000n // 0.41e18
  const epoch = epochRebasePctFrom1e18(rate)
  assert.ok(epoch != null)
  assert.ok(Math.abs(epoch - 0.41) < 1e-9)
  assert.equal(baseDailyPctFromEpoch(epoch), 0.82)
  assert.equal(baseDailyPctFromEpoch(null), null)
  assert.equal(epochRebasePctFrom1e18(null), null)
})

test('compoundInterest daily compounding', () => {
  assert.equal(compoundInterest(100, 0, 10), 0)
  assert.equal(compoundInterest(0, 1, 10), 0)
  const interest = compoundInterest(100, 1, 1)
  assert.ok(Math.abs(interest - 1) < 1e-9)
  const two = compoundInterest(100, 1, 2)
  assert.ok(Math.abs(two - (100 * 1.01 ** 2 - 100)) < 1e-9)
})

test('lockedBonusInterest is non-compounding (2 epochs/day)', () => {
  // 100 principal, 0.5%/epoch, 10% bonus BPS, 1 day → 2 epochs
  // per epoch = 100 * 0.005 * 0.1 = 0.05; ×2 = 0.1
  assert.ok(Math.abs(lockedBonusInterest(100, 0.5, 1000, 1) - 0.1) < 1e-9)
  assert.equal(lockedBonusInterest(100, 0.5, 0, 10), 0)
})

test('periodYieldPct compounds base daily only', () => {
  assert.ok(Math.abs(periodYieldPct(1, 1) - 1) < 1e-9)
  assert.equal(stakePeriodDays('liquid'), 1)
  assert.equal(stakePeriodDays('540'), 540)
})

test('calcLocalInterest: stake adds bonus; xmine stays zero', () => {
  const stake = calcLocalInterest({
    product: 'stake',
    period: '180',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
  })
  const liquid = calcLocalInterest({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
  })
  assert.ok(stake.interest > liquid.interest)
  const xmine = calcLocalInterest({
    product: 'xmine',
    period: 'liquid',
    principal: 100,
    days: 30,
    epochRebasePct: 0.5,
  })
  assert.equal(xmine.interest, 0)
})

test('buildCalcYieldCurvePoints spans day 1..720', () => {
  const points = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 1,
    price: 10,
    epochRebasePct: 0.41,
  })
  assert.equal(points.length, CALC_MAX_DAYS)
  assert.equal(points[0]?.day, 1)
  assert.equal(points[CALC_MAX_DAYS - 1]?.day, 720)
  assert.ok((points[CALC_MAX_DAYS - 1]?.interestUsd ?? 0) >= (points[0]?.interestUsd ?? 0))
})

test('buildCalcYieldCurvePoints: bond interestUsd skips AGX price', () => {
  const bond = buildCalcYieldCurvePoints({
    product: 'lpbond',
    period: '180',
    principal: 100,
    price: 65,
    epochRebasePct: 0.41,
    maxDays: 2,
  })
  const stake = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    price: 65,
    epochRebasePct: 0.41,
    maxDays: 2,
  })
  assert.ok((bond[1]?.interestUsd ?? 0) > 0)
  assert.ok((bond[1]?.interestUsd ?? 0) * 10 < (stake[1]?.interestUsd ?? 0))
})
