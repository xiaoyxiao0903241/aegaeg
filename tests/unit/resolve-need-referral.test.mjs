import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveNeedReferral: bound / unbound / unknown', async () => {
  const { resolveNeedReferral } = await loadModule('/src/core/referral/resolve-need-referral.ts')

  assert.equal(resolveNeedReferral(true), null)
  assert.equal(resolveNeedReferral(false), 'need_referral')
  assert.equal(resolveNeedReferral(undefined), 'need_referral')
  assert.equal(resolveNeedReferral(null), 'need_referral')
})
