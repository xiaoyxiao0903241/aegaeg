import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('evaluateMixedClaim fails when live reward is below claim amount', async () => {
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(
    evaluateMixedClaim({
      amount: 100n,
      rewardAvailable: 50n,
      contribution: 1_000n,
      requiredContribution: 10n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
    }),
    'insufficientReward',
  )
})

test('evaluateMixedClaim does not treat requested amount as available', async () => {
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')
  const amount = 100n

  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: 1n,
      requiredContribution: 10n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
    }),
    'insufficientContribution',
  )
  assert.equal(
    evaluateMixedClaim({
      amount,
      rewardAvailable: amount,
      contribution: 100n,
      requiredContribution: 10n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
    }),
    null,
  )
})

test('evaluateRedeem blocks non-positive redeemable amount', async () => {
  const { evaluateRedeem } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(evaluateRedeem({ amount: 0n }), 'nothingToRedeem')
  assert.equal(evaluateRedeem({ amount: 1n }), null)
})

test('evaluateXmineClaim blocks zero pending and active warmup', async () => {
  const { evaluateXmineClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(evaluateXmineClaim({ pending: 0n, warmupGons: 0n }), 'zeroAmount')
  assert.equal(evaluateXmineClaim({ pending: 1n, warmupGons: 1n }), 'warmupActive')
  assert.equal(evaluateXmineClaim({ pending: 1n, warmupGons: 0n }), null)
})

test('evaluateXmineUnstake prefers warmup block then nothing-to-redeem', async () => {
  const { evaluateXmineUnstake } = await loadModule('/src/core/assets/assets-block-reasons.ts')

  assert.equal(evaluateXmineUnstake({ activeGons: 10n, warmupGons: 1n }), 'warmupActive')
  assert.equal(evaluateXmineUnstake({ activeGons: 0n, warmupGons: 0n }), 'nothingToRedeem')
  assert.equal(evaluateXmineUnstake({ activeGons: 10n, warmupGons: 0n }), null)
})
