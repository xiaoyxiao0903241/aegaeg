import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('evaluateWriteButtonPhase maps handbook §1.4 phases', async () => {
  const { evaluateWriteButtonPhase } = await loadModule('/src/core/wallet/write-button-phase.ts')

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: false,
      writeReady: false,
      needReferral: false,
      moneyBlock: null,
    }),
    'need_wallet',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: false,
      needReferral: false,
      moneyBlock: null,
    }),
    'wrong_network',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      accountMigrated: true,
      moneyBlock: null,
    }),
    'account_migrated',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: true,
      moneyBlock: 'notBound',
    }),
    'need_referral',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyBlock: 'insufficientBalance',
    }),
    'need_balance',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyBlock: 'insufficientAllowance',
    }),
    'need_allowance',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyBlock: null,
      isSubmitting: true,
    }),
    'submitting',
  )

  assert.equal(
    evaluateWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyBlock: null,
    }),
    'ready',
  )
})
