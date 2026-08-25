import assert from 'node:assert/strict'
import test, { afterEach } from 'node:test'

import { loadModule } from '../load-module.mjs'
import {
  claimPlanAndContribHandlers,
  clearMoneyPathReadClient,
  dispatchRead,
  moneyPathSession,
} from './_money-path-read-mock.mjs'

afterEach(clearMoneyPathReadClient)

function luckyReadClient(overrides = {}) {
  const {
    paused = false,
    won = true,
    rewardAmount = 100n,
    rewardClaimed = false,
    contribution = 1_000_000n,
    requiredContribution = 1n,
  } = overrides
  const plans = claimPlanAndContribHandlers({ contribution, requiredContribution })

  return async (request) =>
    dispatchRead(
      {
        ...plans,
        paused: () => paused,
        getWinnerInfo: () => [won, rewardAmount],
        rewardClaimed: () => rewardClaimed,
      },
      request,
    )
}

test('submitLuckyMixedClaim fail-closed when live round is not claimable', async () => {
  const { submitLuckyMixedClaim } = await loadModule('/src/views/dapp/rewards/submit-rewards.ts')
  const { REWARDS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(
    luckyReadClient({ won: true, rewardAmount: 100n, rewardClaimed: true }),
  )

  await assert.rejects(
    () =>
      submitLuckyMixedClaim({
        session,
        roundIds: [1n],
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === REWARDS_BLOCKED.luckyNotClaimable,
  )
})

test('submitLuckyMixedClaim fail-closed when contribution is below live required', async () => {
  const { submitLuckyMixedClaim } = await loadModule('/src/views/dapp/rewards/submit-rewards.ts')
  const { REWARDS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(
    luckyReadClient({ contribution: 10n, requiredContribution: 100n }),
  )

  await assert.rejects(
    () =>
      submitLuckyMixedClaim({
        session,
        roundIds: [1n],
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === REWARDS_BLOCKED.insufficientContribution,
  )
})

test('submitDaoMixedClaim fail-closed when live DaoPool AGX is below signed amount', async () => {
  const { submitDaoMixedClaim } = await loadModule('/src/views/dapp/rewards/submit-rewards.ts')
  const { REWARDS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')
  const { DAO_REWARD_SIGN_TYPE } = await loadModule('/src/shared/api/types/claim.ts')

  const plans = claimPlanAndContribHandlers({
    contribution: 1_000_000n,
    requiredContribution: 1n,
    rewardAvailable: 50n,
  })
  const session = await moneyPathSession(async (request) => dispatchRead(plans, request))

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input) => {
    const url = String(input)
    if (!url.includes('/claim/dao-reward')) throw new Error(`unexpected fetch ${url}`)
    return new Response(
      JSON.stringify({
        code: 0,
        data: {
          signature: `0x${'ab'.repeat(65)}`,
          salt: '0x01',
          amountWei: '100',
          signType: Number(DAO_REWARD_SIGN_TYPE.RANK_REWARD),
          expireTime: Math.floor(Date.now() / 1000) + 3_600,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    await assert.rejects(
      () =>
        submitDaoMixedClaim({
          session,
          token: 't',
          onUnauthorized: () => {},
          rewardType: 'RANK_REWARD',
          releaseDays: 5,
          restakeDays: 360,
          restakePct: 50,
        }),
      (err) => err === REWARDS_BLOCKED.insufficientReward,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('submitDaoMixedClaim rejects empty token before chain reads', async () => {
  const { submitDaoMixedClaim } = await loadModule('/src/views/dapp/rewards/submit-rewards.ts')
  const { WALLET_BLOCKED } = await loadModule('/src/web3/contract-error-message.ts')

  let reads = 0
  const session = await moneyPathSession(async () => {
    reads += 1
    throw new Error('should not read')
  })

  await assert.rejects(
    () =>
      submitDaoMixedClaim({
        session,
        token: '',
        onUnauthorized: () => {},
        rewardType: 'RANK_REWARD',
        releaseDays: 5,
        restakeDays: 360,
        restakePct: 50,
      }),
    (err) => err === WALLET_BLOCKED.NOT_CONNECTED,
  )
  assert.equal(reads, 0)
})
