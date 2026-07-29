import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('evaluateStakeLiveGate blocks unbound / quota / allowance', async () => {
  const { evaluateStakeLiveGate, evaluateBondZapLiveGate, evaluateXmineLiveGate } =
    await loadModule('/src/core/staking/staking-gates.ts')

  assert.equal(
    evaluateStakeLiveGate({
      amount: 1n,
      isBound: false,
      balance: 10n,
      allowance: 10n,
      remainingQuota: 10n,
    }),
    'notBound',
  )

  assert.equal(
    evaluateStakeLiveGate({
      amount: 5n,
      isBound: true,
      balance: 10n,
      allowance: 3n,
      remainingQuota: 10n,
      poolOpen: true,
    }),
    'insufficientAllowance',
  )

  assert.equal(
    evaluateStakeLiveGate({
      amount: 5n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      remainingQuota: 2n,
      poolOpen: true,
    }),
    'insufficientQuota',
  )

  assert.equal(
    evaluateStakeLiveGate({
      amount: 5n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      remainingQuota: 10n,
      poolOpen: true,
    }),
    null,
  )

  assert.equal(
    evaluateBondZapLiveGate({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: false,
    }),
    'depositoryNotAuth',
  )

  assert.equal(
    evaluateXmineLiveGate({
      amount: 5n,
      balance: 10n,
      allowance: 10n,
      miningQuota: 2n,
    }),
    'insufficientQuota',
  )
})

test('period → contract key mapping (Pre-Design §1)', async () => {
  const { resolveStakePoolKey, resolveLpBondDepositoryKey, resolveBurnBondDepositoryKey } =
    await loadModule('/src/core/staking/staking-period.ts')

  assert.equal(resolveStakePoolKey('liquid'), 'liquidStaking')
  assert.equal(resolveStakePoolKey('180'), 'lockedStaking180d')
  assert.equal(resolveStakePoolKey('360'), 'lockedStaking360d')
  assert.equal(resolveStakePoolKey('540'), 'lockedStaking540d')

  assert.equal(resolveLpBondDepositoryKey('180'), 'bondDepository180d')
  assert.equal(resolveLpBondDepositoryKey('540'), 'bondDepository540d')
  assert.equal(resolveBurnBondDepositoryKey('360'), 'burnBondDepository360d')
})
