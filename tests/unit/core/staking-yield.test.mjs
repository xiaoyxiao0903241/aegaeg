import assert from 'node:assert/strict'
import test from 'node:test'

import {
  baseDailyPctFromEpoch,
  buildCalcYieldCurvePoints,
  CALC_MAX_DAYS,
  computeCalcDay,
  EPOCH_SCHEDULE_EMPTY,
  epochRebasePctFrom1e18,
  epochsPerDayFromLength,
  findBreakEvenDay,
  formatEpochScheduleLabels,
  handbookBondDiscountRateBP,
  lockedBonusBps,
  releasedPrincipal,
  scenarioPeriodYieldPct,
} from '../../../src/core/staking/staking-yield.ts'

test('lockedBonusBps matches RewardManager handbook defaults', () => {
  assert.equal(lockedBonusBps('liquid'), 0)
  assert.equal(lockedBonusBps('180'), 1000)
  assert.equal(lockedBonusBps('360'), 1500)
  assert.equal(lockedBonusBps('540'), 2000)
  assert.equal(lockedBonusBps('unknown'), 0)
})

test('epochRebasePctFrom1e18 + baseDailyPctFromEpoch uses epochsPerDay', () => {
  // 0.41% stored as 0.0041 × 1e18（1e18 = 100%）
  const rate = 4_100_000_000_000_000n
  const epoch = epochRebasePctFrom1e18(rate)
  assert.ok(epoch != null)
  assert.ok(Math.abs(epoch - 0.41) < 1e-9)
  assert.equal(baseDailyPctFromEpoch(epoch, null), null)
  assert.equal(baseDailyPctFromEpoch(epoch, undefined), null)
  const daily2 = baseDailyPctFromEpoch(epoch, 2)
  const daily3 = baseDailyPctFromEpoch(epoch, 3)
  assert.ok(daily2 != null && Math.abs(daily2 - 0.82) < 1e-9)
  assert.ok(daily3 != null && Math.abs(daily3 - 1.23) < 1e-9)
  assert.equal(baseDailyPctFromEpoch(null, 2), null)
  assert.equal(baseDailyPctFromEpoch(epoch, 0), null)
  assert.equal(epochRebasePctFrom1e18(null), null)
  // 链上近值 0.0025 × 1e18 → 0.25%
  const chainLike = epochRebasePctFrom1e18(2_499_999_999_939_652n)
  assert.ok(chainLike != null)
  assert.ok(Math.abs(chainLike - 0.25) < 1e-6)
})

test('epochsPerDayFromLength = daySec / (length × secPerBlock)', () => {
  assert.equal(epochsPerDayFromLength(14_400n, 3), 2)
  assert.equal(epochsPerDayFromLength(7200, 3), 4)
  assert.equal(epochsPerDayFromLength(0n, 3), null)
  assert.equal(epochsPerDayFromLength(14_400n, 0), null)
})

test('formatEpochScheduleLabels from epoch length × seconds/block', () => {
  assert.deepEqual(formatEpochScheduleLabels(96_000n, 0.45), {
    blocks: '96,000',
    hours: '12',
    timesPerDay: '2',
  })
  assert.deepEqual(formatEpochScheduleLabels(96_000n, 0.44921875), {
    blocks: '96,000',
    hours: '12',
    timesPerDay: '2',
  })
  assert.deepEqual(formatEpochScheduleLabels(96_000n, 3), {
    blocks: '96,000',
    hours: '80',
    timesPerDay: '0.3',
  })
  assert.deepEqual(formatEpochScheduleLabels(14_400n, 3), {
    blocks: '14,400',
    hours: '12',
    timesPerDay: '2',
  })
  assert.deepEqual(formatEpochScheduleLabels(15_000n, 3), {
    blocks: '15,000',
    hours: '12.5',
    timesPerDay: '1.9',
  })
  const empty = {
    blocks: EPOCH_SCHEDULE_EMPTY,
    hours: EPOCH_SCHEDULE_EMPTY,
    timesPerDay: EPOCH_SCHEDULE_EMPTY,
  }
  assert.deepEqual(formatEpochScheduleLabels(null, 0.45), empty)
  assert.deepEqual(formatEpochScheduleLabels(96_000n, null), empty)
  assert.deepEqual(formatEpochScheduleLabels(0n, 0.45), empty)
  assert.deepEqual(formatEpochScheduleLabels(96_000n, 0), empty)
})

test('scenarioPeriodYieldPct uses on-chain bonus BPS and handbook discountRateBP', () => {
  assert.equal(scenarioPeriodYieldPct(0.41, null, '180', 'stake'), null)
  const stake180 = scenarioPeriodYieldPct(0.41, 2, '180', 'stake')
  const bond180 = scenarioPeriodYieldPct(0.41, 2, '180', 'bond')
  const expectStake180 = (1.0041 ** 360 + 0.0041 * 360 * 0.1 - 1) * 100
  const expectBond180 = (1.0041 ** 360 / 0.85 - 1) * 100
  assert.ok(stake180 != null && Math.abs(stake180 - expectStake180) < 1e-6)
  assert.ok(bond180 != null && Math.abs(bond180 - expectBond180) < 1e-6)
  const stake360 = scenarioPeriodYieldPct(0.41, 2, '360', 'stake')
  const expectStake360 = (1.0041 ** 720 + 0.0041 * 720 * 0.15 - 1) * 100
  assert.ok(stake360 != null && Math.abs(stake360 - expectStake360) < 1e-6)
  const liveBond = scenarioPeriodYieldPct(0.41, 2, '180', 'bond', 9200)
  const expectLive = (1.0041 ** 360 / 0.92 - 1) * 100
  assert.ok(liveBond != null && Math.abs(liveBond - expectLive) < 1e-6)
  assert.equal(scenarioPeriodYieldPct(0.41, 2, '180', 'bond', null), null)
})

test('releasedPrincipal: liquid full on day 1; lock linear cap 1', () => {
  assert.equal(releasedPrincipal(1000, 1, null), 1000)
  assert.equal(releasedPrincipal(1000, 90, 180), 500)
  assert.equal(releasedPrincipal(1000, 180, 180), 1000)
  assert.equal(releasedPrincipal(1000, 200, 180), 1000)
})

test('computeCalcDay: stake 180d uses handbook 10% bonus, per-epoch compound', () => {
  const snap = computeCalcDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    days: 180,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  const n = 360
  const compounded = 1000 * (1.0041 ** n - 1)
  const bonus = 1000 * 0.0041 * n * 0.1
  const rewards = compounded + bonus
  assert.ok(Math.abs(snap.rewards - rewards) < 1e-6)
  assert.equal(snap.releasedAgx, 1000)
  assert.equal(snap.costUsd, 65_000)
  assert.ok(Math.abs(snap.sellUsd - (1000 + rewards) * 65) < 1e-4)
  assert.ok(Math.abs(snap.ratePct - (1.0041 ** n + 0.0041 * n * 0.1 - 1) * 100) < 1e-6)
  assert.ok(snap.rewards > compounded)
})

test('computeCalcDay: LP bond 180d uses live discountRateBP', () => {
  const snap = computeCalcDay({
    product: 'lpbond',
    period: '180',
    amount: 65_000,
    days: 180,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
    discountRateBP: 9200,
  })
  const A = 65_000 / (65 * 0.92)
  const compounded = A * (1.0041 ** 360 - 1)
  assert.ok(Math.abs(snap.principalAgx - A) < 1e-9)
  assert.ok(Math.abs(snap.rewards - compounded) < 1e-6)
  assert.equal(snap.costUsd, 65_000)
  const closed = 1.0041 ** 360 / 0.92 - 1
  assert.ok(Math.abs(snap.ratePct / 100 - closed) < 1e-9)
})

test('computeCalcDay: LP bond missing discountRateBP does not use handbook', () => {
  const snap = computeCalcDay({
    product: 'lpbond',
    period: '180',
    amount: 65_000,
    days: 180,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.equal(snap.principalAgx, 0)
  assert.equal(snap.rewards, 0)
  assert.equal(snap.costUsd, 65_000)
})

test('computeCalcDay: per-epoch compound, not daily 0.82%', () => {
  const snap = computeCalcDay({
    product: 'stake',
    period: 'liquid',
    amount: 100,
    days: 1,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.5,
    epochsPerDay: 2,
  })
  const perEpoch = 100 * (1.005 ** 2 - 1)
  const daily = 100 * (1.01 - 1)
  assert.ok(Math.abs(snap.rewards - perEpoch) < 1e-9)
  assert.ok(Math.abs(perEpoch - daily) > 1e-6)
})

test('computeCalcDay: missing epochsPerDay → zero rewards, release still applies', () => {
  const snap = computeCalcDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    days: 90,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: null,
  })
  assert.equal(snap.rewards, 0)
  assert.equal(snap.releasedAgx, 500)
  assert.equal(snap.costUsd, 65_000)
})

test('computeCalcDay: lock day 90 of 180 only half principal in sell', () => {
  const snap = computeCalcDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    days: 90,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.equal(snap.releasedAgx, 500)
  const early = computeCalcDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    days: 1,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.ok(early.profitUsd < 0)
})

test('computeCalcDay: xmine daily X from on-chain daily pct, values at path prices', () => {
  const snap = computeCalcDay({
    product: 'xmine',
    period: 'liquid',
    amount: 100,
    days: 2,
    pd: 0.02,
    spotUsd: 65,
    epochRebasePct: null,
    epochsPerDay: null,
    xmineDailyPct: 0.1,
  })
  // flat AGX $65, flat X $0.02 → daily X = 100 * 65 * 0.001 / 0.02 = 325
  assert.ok(Math.abs(snap.rewards - 650) < 1e-6)
  assert.ok(snap.rewardsUsd > 0)
  assert.equal(snap.costUsd, 6500)
})

test('findBreakEvenDay: locked 180 with Pd=P0 turns positive before maturity', () => {
  const day = findBreakEvenDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.ok(day != null && day > 1 && day <= 180)
  const before = computeCalcDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    days: day - 1,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  const at = computeCalcDay({
    product: 'stake',
    period: '180',
    amount: 1000,
    days: day,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.ok(before.profitUsd < 0)
  assert.ok(at.profitUsd >= 0)
})

test('handbookBondDiscountRateBP matches BondDepository defaults', () => {
  assert.equal(handbookBondDiscountRateBP('180'), 8500)
  assert.equal(handbookBondDiscountRateBP('360'), 8000)
  assert.equal(handbookBondDiscountRateBP('540'), 7500)
  assert.equal(handbookBondDiscountRateBP('liquid'), null)
})

test('buildCalcYieldCurvePoints: LP bond uses live discountRateBP not handbook', () => {
  const live = buildCalcYieldCurvePoints({
    product: 'lpbond',
    period: '180',
    principal: 65_000,
    price: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
    discountRateBP: 9200,
    maxDays: 1,
  })
  const missing = buildCalcYieldCurvePoints({
    product: 'lpbond',
    period: '180',
    principal: 65_000,
    price: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
    maxDays: 1,
  })
  const liveDay1 = computeCalcDay({
    product: 'lpbond',
    period: '180',
    amount: 65_000,
    days: 1,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
    discountRateBP: 9200,
  })
  assert.equal(live[0]?.profitUsd, liveDay1.profitUsd)
  assert.equal(missing[0]?.profitUsd, -65_000)
  assert.notEqual(live[0]?.profitUsd, missing[0]?.profitUsd)
})

test('buildCalcYieldCurvePoints spans day 1..CALC_MAX_DAYS as profit', () => {
  const points = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 1,
    price: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.equal(CALC_MAX_DAYS, 540)
  assert.equal(points.length, CALC_MAX_DAYS)
  assert.equal(points[0]?.day, 1)
  assert.equal(points[CALC_MAX_DAYS - 1]?.day, CALC_MAX_DAYS)
  assert.ok((points[CALC_MAX_DAYS - 1]?.profitUsd ?? 0) >= (points[0]?.profitUsd ?? 0))
})

test('buildCalcYieldCurvePoints: missing epochsPerDay → release-only profit (no rewards)', () => {
  const points = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    price: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    maxDays: 3,
  })
  const day1 = computeCalcDay({
    product: 'stake',
    period: 'liquid',
    amount: 100,
    days: 1,
    pd: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: null,
  })
  assert.equal(day1.rewards, 0)
  assert.ok(Math.abs((points[0]?.profitUsd ?? 0) - day1.profitUsd) < 1e-9)
})

test('computeCalcDay: stake cost uses spotUsd, not a hardcoded 65', () => {
  const even = computeCalcDay({
    product: 'stake',
    period: 'liquid',
    amount: 1000,
    days: 1,
    pd: 80,
    spotUsd: 80,
    epochRebasePct: 0,
    epochsPerDay: 2,
  })
  assert.equal(even.costUsd, 80_000)
  assert.equal(even.sellUsd, 80_000)
  assert.equal(even.profitUsd, 0)

  const cheaperExit = computeCalcDay({
    product: 'stake',
    period: 'liquid',
    amount: 1000,
    days: 1,
    pd: 65,
    spotUsd: 80,
    epochRebasePct: 0,
    epochsPerDay: 2,
  })
  assert.equal(cheaperExit.costUsd, 80_000)
  assert.equal(cheaperExit.sellUsd, 65_000)
  assert.equal(cheaperExit.profitUsd, -15_000)
})

test('computeCalcDay: missing spotUsd fail-closes instead of falling back to 65', () => {
  const snap = computeCalcDay({
    product: 'stake',
    period: 'liquid',
    amount: 1000,
    days: 1,
    pd: 80,
    spotUsd: 0,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.equal(snap.principalAgx, 0)
  assert.equal(snap.costUsd, 0)
  assert.equal(snap.rewards, 0)
})

test('computeCalcDay: xmine daily X values AGX at spotUsd', () => {
  const snap = computeCalcDay({
    product: 'xmine',
    period: 'liquid',
    amount: 100,
    days: 2,
    pd: 0.02,
    spotUsd: 80,
    epochRebasePct: null,
    epochsPerDay: null,
    xmineDailyPct: 0.1,
  })
  // flat AGX $80, flat X $0.02 → daily X = 100 * 80 * 0.001 / 0.02 = 400
  assert.ok(Math.abs(snap.rewards - 800) < 1e-6)
  assert.equal(snap.costUsd, 8000)
})

test('buildCalcYieldCurvePoints: locked 180 profit is negative early, higher at maturity', () => {
  const points = buildCalcYieldCurvePoints({
    product: 'stake',
    period: '180',
    principal: 1000,
    price: 65,
    spotUsd: 65,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
    maxDays: 180,
  })
  assert.ok((points[0]?.profitUsd ?? 0) < 0)
  assert.ok((points[179]?.profitUsd ?? 0) > 0)
})
