import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('selectLockedClaimLegs: both rewards yield two legs', async () => {
  const { selectLockedClaimLegs } = await loadModule('/src/core/assets/select-locked-claim-legs.ts')
  const legs = selectLockedClaimLegs({ blockReward: 10n, extraInterest: 3n })
  assert.deepEqual(legs, [
    { amount: 10n, extra: false },
    { amount: 3n, extra: true },
  ])
  assert.equal(
    legs.reduce((sum, leg) => sum + leg.amount, 0n),
    13n,
  )
})

test('selectLockedClaimLegs: only extraInterest', async () => {
  const { selectLockedClaimLegs } = await loadModule('/src/core/assets/select-locked-claim-legs.ts')
  assert.deepEqual(selectLockedClaimLegs({ blockReward: 0n, extraInterest: 5n }), [
    { amount: 5n, extra: true },
  ])
})

test('selectLockedClaimLegs: neither stays single zero leg', async () => {
  const { selectLockedClaimLegs } = await loadModule('/src/core/assets/select-locked-claim-legs.ts')
  assert.deepEqual(selectLockedClaimLegs({ blockReward: 0n, extraInterest: 0n }), [
    { amount: 0n, extra: false },
  ])
})
