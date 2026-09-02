import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const AGX_DECIMALS = 9
const X_DECIMALS = 18
const AGX_ACTION_FLOOR = 10n ** 7n
const X_ACTION_FLOOR = 10n ** 16n

test('evaluateMixedClaim fails when live reward is below claim amount', async () => {
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(
    evaluateMixedClaim({
      amount: AGX_ACTION_FLOOR,
      rewardAvailable: AGX_ACTION_FLOOR / 2n,
      contribution: 1_000n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    'insufficientReward',
  )
})

test('evaluateMixedClaim does not treat requested amount as available', async () => {
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')
  const amount = AGX_ACTION_FLOOR

  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: 1n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    'insufficientContribution',
  )
  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: amount,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    null,
  )
})

test('evaluateMixedClaim required contribution is 1:1 with claim amount, not quote/6', async () => {
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')
  const amount = 22_500_000n
  const quoteDiv6 = 3_750_000n

  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: 4_000_000n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    'insufficientContribution',
  )
  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: quoteDiv6,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    'insufficientContribution',
  )
  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: amount,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    null,
  )
})

test('evaluateMixedClaim blocks amounts below the 0.01 display floor', async () => {
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(
    evaluateMixedClaim({
      amount: AGX_ACTION_FLOOR - 1n,
      rewardAvailable: AGX_ACTION_FLOOR,
      contribution: 100n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      decimals: AGX_DECIMALS,
    }),
    'zeroAmount',
  )
})

test('evaluateRedeem blocks amounts below the 0.01 display floor', async () => {
  const { evaluateRedeem } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(evaluateRedeem({ amount: 0n, decimals: AGX_DECIMALS }), 'nothingToRedeem')
  assert.equal(
    evaluateRedeem({ amount: AGX_ACTION_FLOOR - 1n, decimals: AGX_DECIMALS }),
    'nothingToRedeem',
  )
  assert.equal(evaluateRedeem({ amount: AGX_ACTION_FLOOR, decimals: AGX_DECIMALS }), null)
})

test('evaluateXmineClaim blocks dust pending and active warmup', async () => {
  const { evaluateXmineClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(
    evaluateXmineClaim({ pending: 0n, warmupGons: 0n, decimals: X_DECIMALS }),
    'zeroAmount',
  )
  assert.equal(
    evaluateXmineClaim({ pending: X_ACTION_FLOOR - 1n, warmupGons: 0n, decimals: X_DECIMALS }),
    'zeroAmount',
  )
  assert.equal(
    evaluateXmineClaim({ pending: X_ACTION_FLOOR, warmupGons: 1n, decimals: X_DECIMALS }),
    'warmupActive',
  )
  assert.equal(
    evaluateXmineClaim({ pending: X_ACTION_FLOOR, warmupGons: 0n, decimals: X_DECIMALS }),
    null,
  )
})

test('evaluateXmineUnstake prefers warmup then dust miningStake', async () => {
  const { evaluateXmineUnstake } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(
    evaluateXmineUnstake({
      activeGons: 10n,
      warmupGons: 1n,
      miningStake: AGX_ACTION_FLOOR,
      stakeDecimals: AGX_DECIMALS,
    }),
    'warmupActive',
  )
  assert.equal(
    evaluateXmineUnstake({
      activeGons: 0n,
      warmupGons: 0n,
      miningStake: 0n,
      stakeDecimals: AGX_DECIMALS,
    }),
    'nothingToRedeem',
  )
  assert.equal(
    evaluateXmineUnstake({
      activeGons: 10n,
      warmupGons: 0n,
      miningStake: AGX_ACTION_FLOOR - 1n,
      stakeDecimals: AGX_DECIMALS,
    }),
    'nothingToRedeem',
  )
  assert.equal(
    evaluateXmineUnstake({
      activeGons: 10n,
      warmupGons: 0n,
      miningStake: AGX_ACTION_FLOOR,
      stakeDecimals: AGX_DECIMALS,
    }),
    null,
  )
})
