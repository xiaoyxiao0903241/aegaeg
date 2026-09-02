import assert from 'node:assert/strict'
import test, { afterEach } from 'node:test'

import { decodeFunctionData, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import {
  claimPlanAndContribHandlers,
  clearMoneyPathReadClient,
  dispatchRead,
  enc,
  moneyPathSession,
  ok,
  USER,
} from './_money-path-read-mock.mjs'

afterEach(clearMoneyPathReadClient)

test('submitMixedClaim fail-closed when live liquid reward is below the 0.01 floor', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 1_000_000n,
    requiredContribution: 1n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStakeRewards') return [0n, 50n]
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'liquid', amount: 10n ** 7n },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === ASSETS_BLOCKED.zeroAmount,
  )
})

test('submitMixedClaim fail-closed when live early reward is below the 0.01 floor', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 1_000_000n,
    requiredContribution: 1n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStake') {
      return {
        pending: 1n,
        blockReward: 50n,
        extraInterest: 0n,
        claimableBalance: 0n,
        expiry: 1n,
      }
    }
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'early', amount: 10n ** 7n },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === ASSETS_BLOCKED.zeroAmount,
  )
})

test('submitMixedClaim does not keep the open-modal amount when live available is larger', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 10n ** 8n,
    requiredContribution: 1n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStakeRewards') return [0n, 2n * 10n ** 7n]
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'liquid', amount: 10n ** 7n },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err !== ASSETS_BLOCKED.insufficientReward && err !== ASSETS_BLOCKED.zeroAmount,
  )
})

test('submitMixedClaim fail-closed when contribution is below live required', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 10n,
    requiredContribution: 100n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStakeRewards') return [0n, 10n ** 7n]
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'liquid', amount: 10n ** 7n },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === ASSETS_BLOCKED.insufficientContribution,
  )
})

test('submitMixedClaim 1:1: enough for quote/6 is still short', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')
  const claimable = 22_500_000n

  const plans = claimPlanAndContribHandlers({
    contribution: 4_000_000n,
    requiredContribution: 3_750_000n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStakeRewards') return [0n, claimable]
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'liquid', amount: claimable },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === ASSETS_BLOCKED.insufficientContribution,
  )
})

test('submitMixedClaim fail-closed on warmup reward while warmup still active', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 1_000_000n,
    requiredContribution: 1n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStakeRewards') return [10n ** 7n, 0n]
    if (request.functionName === 'isWarmupExpired') return false
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'liquid', amount: 10n ** 7n },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === ASSETS_BLOCKED.zeroAmount,
  )
})

test('submitMixedClaim uses warmup reward when warmup expired and active is zero', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 10n ** 8n,
    requiredContribution: 1n,
  })

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getStakeRewards') return [10n ** 7n, 0n]
    if (request.functionName === 'isWarmupExpired') return true
    return dispatchRead(plans, request)
  })

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: USER,
        target: { source: 'liquid', amount: 10n ** 7n },
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err !== ASSETS_BLOCKED.insufficientReward && err !== ASSETS_BLOCKED.zeroAmount,
  )
})

test('submitReleaseQueueClaim rejects unresolved planIndex before chain reads', async () => {
  const { submitReleaseQueueClaim } = await loadModule('/src/views/dapp/release/submit-release.ts')
  const { RELEASE_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  let reads = 0
  const session = await moneyPathSession(async () => {
    reads += 1
    throw new Error('should not read')
  })

  await assert.rejects(
    () => submitReleaseQueueClaim({ session, planIndex: -1 }),
    (err) => err === RELEASE_BLOCKED.planUnresolved,
  )
  assert.equal(reads, 0)
})

test('submitReleaseQueueClaim fail-closed when live claimable is zero', async () => {
  const { submitReleaseQueueClaim } = await loadModule('/src/views/dapp/release/submit-release.ts')
  const { RELEASE_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'queuePlans') {
      return [{ releaseDuration: 5n * 86_400n, feeRate: 0n, feeRecipient: USER }]
    }
    if (request.functionName === 'aggregate3') {
      const zero = enc(
        'function getReleasedRewardsWithPlanIndex(address,uint8) view returns (uint256)',
        'getReleasedRewardsWithPlanIndex',
        0n,
      )
      const total = enc(
        'function getRewardsWithPlanIndex(address,uint8) view returns (uint256)',
        'getRewardsWithPlanIndex',
        0n,
      )
      const size = enc(
        'function getQueuePlanSize(address,uint8) view returns (uint256)',
        'getQueuePlanSize',
        0n,
      )
      return [ok(zero), ok(total), ok(size)]
    }
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () => submitReleaseQueueClaim({ session, planIndex: 0 }),
    (err) => err === RELEASE_BLOCKED.zeroAmount,
  )
})

test('submitReleaseBufferClaim fail-closed when live claimable is zero', async () => {
  const { submitReleaseBufferClaim } = await loadModule('/src/views/dapp/release/submit-release.ts')
  const { RELEASE_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')
  const { ZERO_ADDRESS } = await loadModule('/src/core/constants.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getHeadSplitterForUser') return ZERO_ADDRESS
    if (request.functionName === 'getReleaseCount') return 0n
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () => submitReleaseBufferClaim({ session, token: 'agx' }),
    (err) => err === RELEASE_BLOCKED.zeroAmount,
  )
})

test('submitReleaseQueueClaim fail-closed for migrated old account after live gate passes', async () => {
  const { submitReleaseQueueClaim } = await loadModule('/src/views/dapp/release/submit-release.ts')
  const { RELEASE_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'queuePlans') {
      return [{ releaseDuration: 5n * 86_400n, feeRate: 0n, feeRecipient: USER }]
    }
    if (request.functionName === 'aggregate3') {
      const first = decodeFunctionData({
        abi: parseAbi([
          'function getReleasedRewardsWithPlanIndex(address,uint8) view returns (uint256)',
          'function getReleasedRewardsWithOffset(address,uint8,uint256,uint256) view returns (uint256)',
          'function migrationEnabled() view returns (bool)',
        ]),
        data: request.args[0][0].callData,
      })
      if (first.functionName === 'migrationEnabled') {
        return [
          ok(enc('function migrationEnabled() view returns (bool)', 'migrationEnabled', true)),
          ok(enc('function isOldAccount(address) view returns (bool)', 'isOldAccount', true)),
        ]
      }
      if (first.functionName === 'getReleasedRewardsWithOffset') {
        return [
          ok(
            enc(
              'function getReleasedRewardsWithOffset(address,uint8,uint256,uint256) view returns (uint256)',
              'getReleasedRewardsWithOffset',
              10n,
            ),
          ),
        ]
      }
      const claimable = enc(
        'function getReleasedRewardsWithPlanIndex(address,uint8) view returns (uint256)',
        'getReleasedRewardsWithPlanIndex',
        10n,
      )
      const total = enc(
        'function getRewardsWithPlanIndex(address,uint8) view returns (uint256)',
        'getRewardsWithPlanIndex',
        10n,
      )
      const size = enc(
        'function getQueuePlanSize(address,uint8) view returns (uint256)',
        'getQueuePlanSize',
        1n,
      )
      return [ok(claimable), ok(total), ok(size)]
    }
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () => submitReleaseQueueClaim({ session, planIndex: 0 }),
    (err) => err === RELEASE_BLOCKED.accountMigrated,
  )
})
