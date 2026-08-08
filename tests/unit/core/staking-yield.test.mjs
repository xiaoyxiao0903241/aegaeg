import assert from 'node:assert/strict'
import test from 'node:test'

import {
  baseDailyPctFromEpoch,
  buildCalcYieldCurvePoints,
  CALC_MAX_DAYS,
  calcLocalInterest,
  compoundInterest,
  epochRebasePctFrom1e18,
  epochsPerDayFromLength,
  handbookBondDiscountRateBP,
  lockedBonusBps,
  lockedBonusInterest,
  periodYieldPct,
  stakePeriodDays,
} from '../../../src/core/staking/staking-yield.ts'

test('lockedBonusBps matches RewardManager handbook defaults', () => {
  assert.equal(lockedBonusBps('liquid'), 0)
  assert.equal(lockedBonusBps('180'), 1000)
  assert.equal(lockedBonusBps('360'), 1500)
  assert.equal(lockedBonusBps('540'), 2000)
  assert.equal(lockedBonusBps('unknown'), 0)
})

test('epochRebasePctFrom1e18 + baseDailyPctFromEpoch uses epochsPerDay', () => {
  // 0.41% stored as 0.41 * 1e18
  const rate = 410000000000000000n // 0.41e18
  const epoch = epochRebasePctFrom1e18(rate)
  assert.ok(epoch != null)
  assert.ok(Math.abs(epoch - 0.41) < 1e-9)
  assert.equal(baseDailyPctFromEpoch(epoch, null), null)
  assert.equal(baseDailyPctFromEpoch(epoch, undefined), null)
  assert.equal(baseDailyPctFromEpoch(epoch, 2), 0.82)
  assert.equal(baseDailyPctFromEpoch(epoch, 3), 1.23)
  assert.equal(baseDailyPctFromEpoch(null, 2), null)
  assert.equal(baseDailyPctFromEpoch(epoch, 0), null)
  assert.equal(epochRebasePctFrom1e18(null), null)
})

test('epochsPerDayFromLength = daySec / (length × secPerBlock)', () => {
  assert.equal(epochsPerDayFromLength(14_400n, 3), 2)
  assert.equal(epochsPerDayFromLength(7200, 3), 4)
  assert.equal(epochsPerDayFromLength(0n, 3), null)
  assert.equal(epochsPerDayFromLength(14_400n, 0), null)
})

test('compoundInterest daily compounding', () => {
  assert.equal(compoundInterest(100, 0, 10), 0)
  assert.equal(compoundInterest(0, 1, 10), 0)
  const interest = compoundInterest(100, 1, 1)
  assert.ok(Math.abs(interest - 1) < 1e-9)
  const two = compoundInterest(100, 1, 2)
  assert.ok(Math.abs(two - (100 * 1.01 ** 2 - 100)) < 1e-9)
})

test('lockedBonusInterest is non-compounding (epochsPerDay)', () => {
  // 100 principal, 0.5%/epoch, 10% bonus BPS, 1 day → perEpoch=0.05
  // 2 epochs/day → 0.1; 3 epochs/day → 0.15；缺日频 → 0
  assert.equal(lockedBonusInterest(100, 0.5, 1000, 1, null), 0)
  assert.ok(Math.abs(lockedBonusInterest(100, 0.5, 1000, 1, 2) - 0.1) < 1e-9)
  assert.ok(Math.abs(lockedBonusInterest(100, 0.5, 1000, 1, 3) - 0.15) < 1e-9)
  assert.equal(lockedBonusInterest(100, 0.5, 0, 10, 2), 0)
})

test('calcLocalInterest uses epochsPerDay for stake daily rate', () => {
  const two = calcLocalInterest({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
    epochsPerDay: 2,
  })
  const three = calcLocalInterest({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
    epochsPerDay: 3,
  })
  // liquid: compound only; daily 1% vs 1.5%
  assert.ok(Math.abs(two.interest - 1) < 1e-9)
  assert.ok(Math.abs(three.interest - 1.5) < 1e-9)
})

test('calcLocalInterest: missing epochsPerDay → zero stake interest', () => {
  const missing = calcLocalInterest({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
  })
  assert.equal(missing.interest, 0)
  assert.equal(missing.total, 100)
})

test('periodYieldPct compounds base daily only', () => {
  assert.ok(Math.abs(periodYieldPct(1, 1) - 1) < 1e-9)
  assert.equal(stakePeriodDays('liquid'), 1)
  assert.equal(stakePeriodDays('540'), 540)
})

test('calcLocalInterest: stake adds bonus; xmine without daily stays zero', () => {
  const stake = calcLocalInterest({
    product: 'stake',
    period: '180',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
    epochsPerDay: 2,
  })
  const liquid = calcLocalInterest({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    days: 1,
    epochRebasePct: 0.5,
    epochsPerDay: 2,
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

test('calcLocalInterest: xmine uses linear principal * dailyPct/100 * days (not compound)', () => {
  // yieldRateBP=100 → dailyPct=1；线性 = 100 * 1/100 * 10 = 10
  // 复利会是 100*((1.01)^10-1) ≈ 10.46
  const xmine = calcLocalInterest({
    product: 'xmine',
    period: 'liquid',
    principal: 100,
    days: 10,
    epochRebasePct: null,
    xmineDailyPct: 1,
  })
  assert.ok(Math.abs(xmine.interest - 10) < 1e-9)
  assert.ok(Math.abs(xmine.total - 110) < 1e-9)
  assert.ok(Math.abs(xmine.interest - compoundInterest(100, 1, 10)) > 0.4)
})

test('calcLocalInterest: bonds discount USD1→AGX before rebase interest', () => {
  // 1000 USD1 @ $10、discountRateBP=8500 → AGX = 1000/10 * 10000/8500 ≈ 117.647
  // 日率 1%（epoch 0.5%×2）、1 天 → interest AGX ≈ 1.17647 → USD ≈ 11.7647
  const bond = calcLocalInterest({
    product: 'lpbond',
    period: '180',
    principal: 1000,
    days: 1,
    epochRebasePct: 0.5,
    agxPriceUsd: 10,
    discountRateBP: 8500,
    epochsPerDay: 2,
  })
  const agxPrincipal = (1000 / 10) * (10_000 / 8500)
  const expectedInterestUsd = compoundInterest(agxPrincipal, 1, 1) * 10
  assert.ok(Math.abs(bond.interest - expectedInterestUsd) < 1e-6)
  // 无折扣（按 USD 本金直接复利）会系统性偏低
  const naiveUsd = compoundInterest(1000, 1, 1)
  assert.ok(bond.interest > naiveUsd)
})

test('calcLocalInterest: bonds fail-closed when price or discount missing/invalid', () => {
  const noPrice = calcLocalInterest({
    product: 'burnbond',
    period: '180',
    principal: 1000,
    days: 10,
    epochRebasePct: 0.5,
    discountRateBP: 8500,
    epochsPerDay: 2,
  })
  assert.equal(noPrice.interest, 0)
  const badDiscount = calcLocalInterest({
    product: 'lpbond',
    period: '180',
    principal: 1000,
    days: 10,
    epochRebasePct: 0.5,
    agxPriceUsd: 10,
    discountRateBP: 0,
    epochsPerDay: 2,
  })
  assert.equal(badDiscount.interest, 0)
})

test('handbookBondDiscountRateBP matches BondDepository defaults', () => {
  assert.equal(handbookBondDiscountRateBP('180'), 8500)
  assert.equal(handbookBondDiscountRateBP('360'), 8000)
  assert.equal(handbookBondDiscountRateBP('540'), 7500)
  assert.equal(handbookBondDiscountRateBP('liquid'), null)
})

test('buildCalcYieldCurvePoints spans day 1..720', () => {
  const points = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 1,
    price: 10,
    epochRebasePct: 0.41,
    epochsPerDay: 2,
  })
  assert.equal(points.length, CALC_MAX_DAYS)
  assert.equal(points[0]?.day, 1)
  assert.equal(points[CALC_MAX_DAYS - 1]?.day, 720)
  assert.ok((points[CALC_MAX_DAYS - 1]?.interestUsd ?? 0) >= (points[0]?.interestUsd ?? 0))
})

test('buildCalcYieldCurvePoints: missing epochsPerDay → zero interest', () => {
  const points = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    price: 10,
    epochRebasePct: 0.41,
    maxDays: 3,
  })
  assert.equal(
    points.every((p) => p.interestUsd === 0),
    true,
  )
})

test('buildCalcYieldCurvePoints: bond interestUsd uses discounted AGX then × price', () => {
  const bond = buildCalcYieldCurvePoints({
    product: 'lpbond',
    period: '180',
    principal: 100,
    price: 65,
    epochRebasePct: 0.41,
    maxDays: 2,
    discountRateBP: 8500,
    epochsPerDay: 2,
  })
  const stake = buildCalcYieldCurvePoints({
    product: 'stake',
    period: 'liquid',
    principal: 100,
    price: 65,
    epochRebasePct: 0.41,
    maxDays: 2,
    epochsPerDay: 2,
  })
  assert.ok((bond[1]?.interestUsd ?? 0) > 0)
  // 同名义本金下，债券先折成更少 AGX，利息 USD 应低于直接拿 100 AGX 质押
  assert.ok((bond[1]?.interestUsd ?? 0) < (stake[1]?.interestUsd ?? 0))
})
