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

test('submitMixedClaim does not keep the open-modal amount when live available is larger', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 1_000_000n,
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
      return [ok(zero), ok(total)]
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
      return [ok(claimable), ok(total)]
    }
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () => submitReleaseQueueClaim({ session, planIndex: 0 }),
    (err) => err === RELEASE_BLOCKED.accountMigrated,
  )
})
