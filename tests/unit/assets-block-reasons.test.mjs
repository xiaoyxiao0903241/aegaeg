import assert from 'node:assert/strict'
import test from 'node:test'

function evaluateMixedClaim(args) {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.rewardAvailable < args.amount) return 'insufficientReward'
  if (args.releasePlanIndex == null) return 'releasePlanUnresolved'
  if (args.restakePlanIndex == null) return 'restakePlanUnresolved'
  if (args.contribution < args.requiredContribution) return 'insufficientContribution'
  return null
}

test('evaluateMixedClaim fails when live reward is below claim amount', () => {
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

test('evaluateMixedClaim does not treat requested amount as available', () => {
  const amount = 100n
  // Bug pattern: rewardAvailable === amount always passes reward check
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
