import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

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

test('submitMixedClaim source must call readMixedRewardAvailable; envelope in hook (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  const hookSrc = await readFile(
    new URL('../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  assert.match(submitSrc, /readMixedRewardAvailable/)
  assert.match(submitSrc, /dualCheckMixedClaim/)
  assert.doesNotMatch(submitSrc, /submitWithUnknownReceiptLock/)
  assert.doesNotMatch(submitSrc, /rewardAvailable:\s*amount/)
  assert.match(hookSrc, /submitWithUnknownReceiptLock/)
})
