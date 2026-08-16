import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('matchPlanIndexByDurationDays maps UI days to raw index', async () => {
  const { matchPlanIndexByDurationDays, SECONDS_PER_DAY } = await loadModule(
    '/src/core/assets/claim-plans.ts',
  )
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

test('restake plans keep raw RestakeConfig index (not filtered order)', async () => {
  const { matchPlanIndexByDurationDays, SECONDS_PER_DAY } = await loadModule(
    '/src/core/assets/claim-plans.ts',
  )
  const plans = [
    { index: 0, durationSeconds: 180n * SECONDS_PER_DAY, exists: false },
    { index: 1, durationSeconds: 360n * SECONDS_PER_DAY },
    { index: 2, durationSeconds: 540n * SECONDS_PER_DAY },
  ]
  assert.equal(matchPlanIndexByDurationDays(plans, 360), 1)
  assert.equal(matchPlanIndexByDurationDays(plans, 540), 2)
  assert.equal(matchPlanIndexByDurationDays(plans, 180), null)
})

test('restakeBpsFromPct and claim split stay complementary', async () => {
  const { restakeBpsFromPct, claimSplitFromReleasePct } = await loadModule(
    '/src/core/assets/claim-plans.ts',
  )
  assert.equal(restakeBpsFromPct(0), 0)
  assert.equal(restakeBpsFromPct(50), 5000)
  assert.equal(restakeBpsFromPct(100), 10_000)
  const split = claimSplitFromReleasePct(40)
  assert.equal(split.releasePct, 40)
  assert.equal(split.restakePct, 60)
  assert.equal(restakeBpsFromPct(split.restakePct), 6000)
})
