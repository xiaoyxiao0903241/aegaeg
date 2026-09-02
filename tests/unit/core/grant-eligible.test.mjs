import assert from 'node:assert/strict'
import test from 'node:test'

import { isGrantNodeEligible } from '../../../src/core/rewards/grant-eligible.ts'

test('isGrantNodeEligible is true only for explicit true', () => {
  assert.equal(isGrantNodeEligible(true), true)
  assert.equal(isGrantNodeEligible(false), false)
  assert.equal(isGrantNodeEligible(null), false)
  assert.equal(isGrantNodeEligible(undefined), false)
})
