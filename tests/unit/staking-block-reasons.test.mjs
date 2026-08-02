import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('evaluateStakeLive blocks unbound / quota / allowance', async () => {
  const { evaluateStakeLive, evaluateBondZapLive, evaluateXmineLive } = await loadModule(
    '/src/core/staking/staking-block-reasons.ts',
  )

  assert.equal(
    evaluateStakeLive({
      amount: 1n,
      isBound: false,
      balance: 10n,
      allowance: 10n,
      remainingQuota: 10n,
    }),
    'notBound',
  )

  assert.equal(
    evaluateStakeLive({
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
    evaluateStakeLive({
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
    evaluateStakeLive({
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
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: false,
    }),
    'depositoryNotAuth',
  )

  assert.equal(
    evaluateStakeLive({
      amount: 5n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      remainingQuota: 10n,
      poolOpen: true,
      isOldAccount: true,
    }),
    'accountMigrated',
  )

  assert.equal(
    evaluateStakeLive({
      amount: 5n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      remainingQuota: 10n,
      poolOpen: true,
      isOldAccount: null,
    }),
    'unavailable',
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      isOldAccount: true,
    }),
    'accountMigrated',
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      isOldAccount: null,
    }),
    'unavailable',
  )

  assert.equal(
    evaluateXmineLive({
      amount: 5n,
      balance: 10n,
      allowance: 10n,
      miningQuota: 2n,
    }),
    'insufficientQuota',
  )
})

test('xmineSpendableCap is min(balance, remaining quota)', async () => {
  const { xmineSpendableCap } = await loadModule('/src/core/staking/staking-block-reasons.ts')

  assert.equal(xmineSpendableCap(10n, 100n, 0n), 10n)
  assert.equal(xmineSpendableCap(100n, 40n, 0n), 40n)
  assert.equal(xmineSpendableCap(100n, 100n, 60n), 40n)
  assert.equal(xmineSpendableCap(10n, 100n, 60n), 10n)
  assert.equal(xmineSpendableCap(50n, 30n, 30n), 0n)
})

test('period → contract key mapping (Pre-Design §1)', async () => {
  const { stakePoolKey, lpBondDepositoryKey, burnBondDepositoryKey } = await loadModule(
    '/src/core/staking/staking-period.ts',
  )

  assert.equal(stakePoolKey('liquid'), 'liquidStaking')
  assert.equal(stakePoolKey('180'), 'lockedStaking180d')
  assert.equal(stakePoolKey('360'), 'lockedStaking360d')
  assert.equal(stakePoolKey('540'), 'lockedStaking540d')

  assert.equal(lpBondDepositoryKey('180'), 'bondDepository180d')
  assert.equal(lpBondDepositoryKey('540'), 'bondDepository540d')
  assert.equal(burnBondDepositoryKey('360'), 'burnBondDepository360d')
})
