import assert from 'node:assert/strict'
import test from 'node:test'
import {
  evaluateRewardsMixedClaim,
  evaluateRewardsSimpleClaim,
  isLuckyClaimable,
} from '../../src/core/rewards/rewards-block-reasons.ts'

test('simple claim separates session gate from zero amount', () => {
  assert.equal(
    evaluateRewardsSimpleClaim({ sessionReady: false, amount: 0n, unknownLocked: false }),
    'notSessionReady',
  )
  assert.equal(
    evaluateRewardsSimpleClaim({ sessionReady: true, amount: 0n, unknownLocked: false }),
    'zeroAmount',
  )
  assert.equal(
    evaluateRewardsSimpleClaim({ sessionReady: true, amount: 1n, unknownLocked: true }),
    'lockedUnknown',
  )
  assert.equal(
    evaluateRewardsSimpleClaim({ sessionReady: true, amount: 1n, unknownLocked: false }),
    null,
  )
})

test('mixed claim fails closed on paused lucky and insufficient contribution', () => {
  assert.equal(
    evaluateRewardsMixedClaim({
      amount: 100n,
      rewardAvailable: 100n,
      contribution: 10n,
      requiredContribution: 10n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      luckyPaused: true,
      luckyClaimable: true,
    }),
    'luckyPaused',
  )
  assert.equal(
    evaluateRewardsMixedClaim({
      amount: 100n,
      rewardAvailable: 100n,
      contribution: 1n,
      requiredContribution: 10n,
      releasePlanIndex: 0,
      restakePlanIndex: 1,
      luckyClaimable: true,
    }),
    'insufficientContribution',
  )
})

test('mixed claim fails when live reward is below claim amount', () => {
  assert.equal(
    evaluateRewardsMixedClaim({
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

test('submit rewards mixed must not self-certify rewardAvailable === amount', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../src/views/dapp/rewards/submit-rewards.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /readDaoPoolRewardAvailable/)
  assert.match(src, /readLuckyClaimSnapshot/)
  assert.doesNotMatch(src, /rewardAvailable:\s*amount/)
})

test('isLuckyClaimable requires won + unclaimed + amount + not paused', () => {
  assert.equal(
    isLuckyClaimable({ paused: true, won: true, rewardClaimed: false, rewardAmount: 1n }),
    false,
  )
  assert.equal(
    isLuckyClaimable({ paused: false, won: false, rewardClaimed: false, rewardAmount: 1n }),
    false,
  )
  assert.equal(
    isLuckyClaimable({ paused: false, won: true, rewardClaimed: true, rewardAmount: 1n }),
    false,
  )
  assert.equal(
    isLuckyClaimable({ paused: false, won: true, rewardClaimed: false, rewardAmount: 0n }),
    false,
  )
  assert.equal(
    isLuckyClaimable({ paused: false, won: true, rewardClaimed: false, rewardAmount: 1n }),
    true,
  )
})
