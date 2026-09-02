import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isReferralParentAllowed: bound parent ok', async () => {
  const { isReferralParentAllowed } = await loadModule(
    '/src/core/referral/referral-parent-allowed.ts',
  )
  assert.equal(
    isReferralParentAllowed({
      parent: '0x1111111111111111111111111111111111111111',
      parentBound: true,
      root: '0x2222222222222222222222222222222222222222',
    }),
    true,
  )
})

test('isReferralParentAllowed: unbound non-root rejected', async () => {
  const { isReferralParentAllowed } = await loadModule(
    '/src/core/referral/referral-parent-allowed.ts',
  )
  assert.equal(
    isReferralParentAllowed({
      parent: '0x1111111111111111111111111111111111111111',
      parentBound: false,
      root: '0x2222222222222222222222222222222222222222',
    }),
    false,
  )
})

test('isReferralParentAllowed: root allowed even when unbound', async () => {
  const { isReferralParentAllowed } = await loadModule(
    '/src/core/referral/referral-parent-allowed.ts',
  )
  const root = '0xAbCDEF0000000000000000000000000000000001'
  assert.equal(
    isReferralParentAllowed({
      parent: root,
      parentBound: false,
      root,
    }),
    true,
  )
  assert.equal(
    isReferralParentAllowed({
      parent: root.toLowerCase(),
      parentBound: false,
      root: root.toUpperCase(),
    }),
    true,
  )
})
