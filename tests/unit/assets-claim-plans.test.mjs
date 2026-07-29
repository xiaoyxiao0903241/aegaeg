import assert from 'node:assert/strict'
import test from 'node:test'

const SECONDS_PER_DAY = 86_400n

function matchPlanIndexByDurationDays(plans, days) {
  const target = BigInt(days) * SECONDS_PER_DAY
  for (const plan of plans) {
    if (plan.exists === false) continue
    if (plan.durationSeconds === target) return plan.index
  }
  return null
}

function restakeBpsFromPct(restakePct) {
  const pct = Math.min(100, Math.max(0, Math.round(restakePct)))
  return pct * 100
}

function claimSplitFromReleasePct(releasePct) {
  const release = Math.min(100, Math.max(0, Math.round(releasePct)))
  return { releasePct: release, restakePct: 100 - release }
}

test('matchPlanIndexByDurationDays maps UI days to raw index', () => {
  const plans = [
    { index: 0, durationSeconds: 5n * SECONDS_PER_DAY },
    { index: 1, durationSeconds: 20n * SECONDS_PER_DAY },
    { index: 2, durationSeconds: 40n * SECONDS_PER_DAY, exists: false },
    { index: 3, durationSeconds: 60n * SECONDS_PER_DAY },
  ]
  assert.equal(matchPlanIndexByDurationDays(plans, 5), 0)
  assert.equal(matchPlanIndexByDurationDays(plans, 20), 1)
  assert.equal(matchPlanIndexByDurationDays(plans, 40), null)
  assert.equal(matchPlanIndexByDurationDays(plans, 60), 3)
  assert.equal(matchPlanIndexByDurationDays(plans, 180), null)
})

test('restake plans keep raw RestakeConfig index (not filtered order)', () => {
  const plans = [
    { index: 0, durationSeconds: 180n * SECONDS_PER_DAY, exists: false },
    { index: 1, durationSeconds: 360n * SECONDS_PER_DAY },
    { index: 2, durationSeconds: 540n * SECONDS_PER_DAY },
  ]
  assert.equal(matchPlanIndexByDurationDays(plans, 360), 1)
  assert.equal(matchPlanIndexByDurationDays(plans, 540), 2)
  assert.equal(matchPlanIndexByDurationDays(plans, 180), null)
})

test('restakeBpsFromPct and claim split stay complementary', () => {
  assert.equal(restakeBpsFromPct(0), 0)
  assert.equal(restakeBpsFromPct(50), 5000)
  assert.equal(restakeBpsFromPct(100), 10_000)
  const split = claimSplitFromReleasePct(40)
  assert.equal(split.releasePct, 40)
  assert.equal(split.restakePct, 60)
  assert.equal(restakeBpsFromPct(split.restakePct), 6000)
})
