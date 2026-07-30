import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveWriteButtonPhase maps handbook §1.4 phases', async () => {
  const { resolveWriteButtonPhase } = await loadModule(
    '/src/core/wallet/resolve-write-button-phase.ts',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: false,
      writeReady: false,
      needReferral: false,
      moneyGate: null,
    }),
    'need_wallet',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: false,
      needReferral: false,
      moneyGate: null,
    }),
    'wrong_network',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      accountMigrated: true,
      moneyGate: null,
    }),
    'account_migrated',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: true,
      moneyGate: 'notBound',
    }),
    'need_referral',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyGate: 'insufficientBalance',
    }),
    'need_balance',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyGate: 'insufficientAllowance',
    }),
    'need_allowance',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyGate: null,
      isSubmitting: true,
    }),
    'submitting',
  )

  assert.equal(
    resolveWriteButtonPhase({
      walletReady: true,
      writeReady: true,
      needReferral: false,
      moneyGate: null,
    }),
    'ready',
  )
})
