import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('evaluateNeedReferral: bound / unbound / unknown', async () => {
  const { evaluateNeedReferral } = await loadModule('/src/core/referral/need-referral.ts')

  assert.equal(evaluateNeedReferral(true), null)
  assert.equal(evaluateNeedReferral(false), 'need_referral')
  assert.equal(evaluateNeedReferral(undefined), 'need_referral')
  assert.equal(evaluateNeedReferral(null), 'need_referral')
})
