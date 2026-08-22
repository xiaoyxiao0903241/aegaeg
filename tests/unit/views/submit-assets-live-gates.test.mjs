import assert from 'node:assert/strict'
import test, { afterEach } from 'node:test'

import { loadModule } from '../load-module.mjs'
import { clearMoneyPathReadClient, moneyPathSession, USER, ZERO } from './_money-path-read-mock.mjs'

afterEach(clearMoneyPathReadClient)

test('submitBondRedeem fail-closed when live pending payout is zero', async () => {
  const { submitBondRedeem } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const calls = []
  const session = await moneyPathSession(async (request) => {
    calls.push(request.functionName)
    if (request.functionName === 'pendingPayoutFor') return 0n
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () =>
      submitBondRedeem({
        session,
        capturedAddress: USER,
        row: {
          id: 'lp-180-0',
          kind: 'lp',
          period: '180',
          depository: '0x2222222222222222222222222222222222222222',
          bondIndex: 0,
          payoutRemaining: 1n,
          pendingPayout: 1n,
          profit: 0n,
          vestingEndTime: 0n,
          exists: true,
        },
      }),
    (err) => err === ASSETS_BLOCKED.nothingToRedeem,
  )
  // Must re-read chain pendingPayoutFor — UI row.pendingPayout must not authorize the write.
  assert.ok(calls.includes('pendingPayoutFor'))
})

test('submitStakeRedeem fail-closed for locked row with zero released principal', async () => {
  const { submitStakeRedeem } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'getReleasedPrincipal') return 0n
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () =>
      submitStakeRedeem({
        session,
        capturedAddress: USER,
        row: {
          id: 'locked-180-0',
          kind: 'locked',
          period: '180',
          pool: '0x3333333333333333333333333333333333333333',
          stakeIndex: 0,
          principal: 1n,
          releasedPrincipal: 1n,
          blockReward: 0n,
          extraInterest: 0n,
          claimableBalance: 0n,
          expiry: 0n,
        },
      }),
    (err) => err === ASSETS_BLOCKED.nothingToRedeem,
  )
})

test('submitStakeRedeem blocks liquid warmup before any chain read', async () => {
  const { submitStakeRedeem } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  let readCalls = 0
  const session = await moneyPathSession(async () => {
    readCalls += 1
    throw new Error('should not read')
  })

  await assert.rejects(
    () =>
      submitStakeRedeem({
        session,
        capturedAddress: USER,
        row: {
          id: 'liquid',
          kind: 'liquid',
          period: 'liquid',
          pool: '0x0C5173c87aB8684eEc028a2bF56061a37415d224',
          stakeIndex: null,
          principal: 1n,
          releasedPrincipal: 0n,
          blockReward: 0n,
          extraInterest: 0n,
          claimableBalance: 0n,
          expiry: 0n,
          inWarmup: true,
        },
      }),
    (err) => err === ASSETS_BLOCKED.warmupActive,
  )
  assert.equal(readCalls, 0)
})

function xmineReadClient(overrides = {}) {
  const {
    pending = 0n,
    pendingValue = 0n,
    miningStake = 0n,
    gons = 0n,
    warmupGons = 0n,
    warmupEndTime = 0n,
  } = overrides
  return async (request) => {
    switch (request.functionName) {
      case 'migratedFrom':
        return ZERO
      case 'pendingReward':
        return pending
      case 'pendingRewardValue':
        return pendingValue
      case 'miningStakeAmountOf':
        return miningStake
      case 'stakes':
        return [gons, warmupGons, 0n, warmupEndTime, 0n]
      default:
        throw new Error(`unexpected ${request.functionName}`)
    }
  }
}

test('submitXmineClaim fail-closed when live pending is zero', async () => {
  const { submitXmineClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(xmineReadClient({ pending: 0n, warmupGons: 0n }))
  await assert.rejects(
    () => submitXmineClaim({ session }),
    (err) => err === ASSETS_BLOCKED.zeroAmount,
  )
})

test('submitXmineClaim fail-closed while warmup gons remain', async () => {
  const { submitXmineClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(xmineReadClient({ pending: 10n ** 16n, warmupGons: 1n }))
  await assert.rejects(
    () => submitXmineClaim({ session }),
    (err) => err === ASSETS_BLOCKED.warmupActive,
  )
})

test('submitXmineUnstake fail-closed during warmup', async () => {
  const { submitXmineUnstake } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(xmineReadClient({ gons: 10n, warmupGons: 1n }))
  await assert.rejects(
    () => submitXmineUnstake({ session }),
    (err) => err === ASSETS_BLOCKED.warmupActive,
  )
})

test('submitXmineActivateWarmup fail-closed when no warmup gons', async () => {
  const { submitXmineActivateWarmup } = await loadModule('/src/views/dapp/assets/submit-assets.ts')
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(xmineReadClient({ warmupGons: 0n, warmupEndTime: 100n }))
  await assert.rejects(
    () => submitXmineActivateWarmup({ session }),
    (err) => err === ASSETS_BLOCKED.noWarmup,
  )
})
