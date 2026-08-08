import assert from 'node:assert/strict'
import test from 'node:test'

import {
  pickStakeEffectiveQuota,
  remainingAfterFiniteLimit,
} from '../../../src/core/staking/stake-quota.ts'

test('remainingAfterFiniteLimit treats 0 limit as unlimited', () => {
  assert.equal(remainingAfterFiniteLimit(0n, 100n), null)
  assert.equal(remainingAfterFiniteLimit(50n, 20n), 30n)
  assert.equal(remainingAfterFiniteLimit(20n, 20n), 0n)
  assert.equal(remainingAfterFiniteLimit(10n, 20n), 0n)
})

test('pickStakeEffectiveQuota prefers personal when it is tighter than pool', () => {
  assert.deepEqual(
    pickStakeEffectiveQuota({
      poolRemaining: 100n,
      personalRemaining: 40n,
      personalDailyRemaining: 80n,
    }),
    { remaining: 40n, kind: 'personal' },
  )
})

test('pickStakeEffectiveQuota labels pool when global capacity is the bottleneck', () => {
  assert.deepEqual(
    pickStakeEffectiveQuota({
      poolRemaining: 5n,
      personalRemaining: 100n,
      personalDailyRemaining: 100n,
    }),
    { remaining: 5n, kind: 'pool' },
  )
})

test('pickStakeEffectiveQuota labels personalDaily when daily is tightest', () => {
  assert.deepEqual(
    pickStakeEffectiveQuota({
      poolRemaining: 100n,
      personalRemaining: 100n,
      personalDailyRemaining: 7n,
    }),
    { remaining: 7n, kind: 'personalDaily' },
  )
})

test('pickStakeEffectiveQuota ignores unlimited personal layers', () => {
  assert.deepEqual(
    pickStakeEffectiveQuota({
      poolRemaining: 12n,
      personalRemaining: null,
      personalDailyRemaining: null,
    }),
    { remaining: 12n, kind: 'pool' },
  )
})

test('pickStakeEffectiveQuota prefers personal on ties with pool', () => {
  assert.deepEqual(
    pickStakeEffectiveQuota({
      poolRemaining: 10n,
      personalRemaining: 10n,
    }),
    { remaining: 10n, kind: 'personal' },
  )
})
