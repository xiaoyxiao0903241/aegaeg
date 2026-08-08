import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

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
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 100n * 10_000_000n,
      totalDeposit: 90n * 10_000_000n,
      netPayout: 20n * 10_000_000n,
      grossPayout: 20n * 10_000_000n,
      maxPayout: 1000n * 10_000_000n,
    }),
    'insufficientDebtCapacity',
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 90n * 10_000_000n,
      netPayout: 20n * 10_000_000n,
      grossPayout: 20n * 10_000_000n,
      maxPayout: 1000n * 10_000_000n,
    }),
    null,
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: null,
      totalDeposit: 0n,
      netPayout: 0n,
    }),
    'unavailable',
  )

  // 0.01 AGX = 1e7（9 decimals）；手册 ErrorBondTooSmall / ErrorBondTooLarge 用 gross
  const minPayout = 10_000_000n
  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout - 1n,
      grossPayout: minPayout - 1n,
      maxPayout: 1_000_000_000n,
    }),
    'bondTooSmall',
  )

  // fee 后 net 偏小、gross 达标 → 不以 net 误拦 TooSmall
  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout - 1n,
      grossPayout: minPayout,
      maxPayout: 1_000_000_000n,
    }),
    null,
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout,
      grossPayout: minPayout,
      maxPayout: minPayout,
    }),
    null,
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout,
      grossPayout: minPayout + 1n,
      maxPayout: minPayout,
    }),
    'bondTooLarge',
  )

  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout,
      grossPayout: minPayout,
      maxPayout: null,
    }),
    'unavailable',
  )

  // maxPayout / grossPayout 没传时按不可用处理
  assert.equal(
    evaluateBondZapLive({
      amount: 1n,
      isBound: true,
      balance: 10n,
      allowance: 10n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout,
    }),
    'unavailable',
  )

  // 授权不足时仍应先报「兑付过小」，不要让用户先去授权
  assert.equal(
    evaluateBondZapLive({
      amount: 100n,
      isBound: true,
      balance: 100n,
      allowance: 1n,
      depositoryAuthorized: true,
      maxDebt: 0n,
      totalDeposit: 0n,
      netPayout: minPayout - 1n,
      grossPayout: minPayout - 1n,
      maxPayout: 1_000_000_000n,
    }),
    'bondTooSmall',
  )

  // 授权不足时仍应先报「额度不够」
  assert.equal(
    evaluateStakeLive({
      amount: 5n,
      isBound: true,
      balance: 10n,
      allowance: 1n,
      remainingQuota: 2n,
      poolOpen: true,
    }),
    'insufficientQuota',
  )

  assert.equal(
    evaluateXmineLive({
      amount: 5n,
      balance: 10n,
      allowance: 1n,
      miningQuota: 2n,
    }),
    'insufficientQuota',
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
