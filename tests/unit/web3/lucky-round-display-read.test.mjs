import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const USER = '0x1111111111111111111111111111111111111111'

test('readLuckyRoundDisplaySnapshot follows handbook §14.1 tracker + accepting window', async () => {
  const { readLuckyRoundDisplaySnapshot } = await loadModule('/src/web3/rewards/rewards-read.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const calls = []
  const client = {
    async readContract(request) {
      calls.push({
        fn: request.functionName,
        address: String(request.address).toLowerCase(),
        args: request.args,
      })
      if (request.functionName === 'getCurrentRoundUserStat') {
        return [7n, 5n * 10n ** 18n, true, 11n]
      }
      if (request.functionName === 'getRound') {
        return { endTime: 99n }
      }
      if (request.functionName === 'isRoundAcceptingPurchases') {
        return true
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await readLuckyRoundDisplaySnapshot(USER, client)

  assert.equal(snap.openRoundId, 7n)
  assert.equal(snap.endTimeSec, 99n)
  assert.equal(snap.eligible, true)
  assert.equal(snap.roundPurchaseUsd1, 5n * 10n ** 18n)
  assert.equal(snap.accepting, true)
  assert.equal(
    calls[0]?.address,
    BSC_CONTRACTS.dailyPurchaseTracker.toLowerCase(),
    'tracker reads must use catalog DailyPurchaseTracker',
  )
  assert.deepEqual(
    calls.map((c) => c.fn),
    ['getCurrentRoundUserStat', 'getRound', 'isRoundAcceptingPurchases'],
  )
  assert.equal(
    calls.some((c) =>
      ['currentRoundId', 'purchaseTracker', 'getUserRoundStat', 'isUserEligible'].includes(c.fn),
    ),
    false,
  )
})

test('readLuckyRoundDisplaySnapshot skips round reads when tracker roundId is 0', async () => {
  const { readLuckyRoundDisplaySnapshot } = await loadModule('/src/web3/rewards/rewards-read.ts')

  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getCurrentRoundUserStat') {
        return [0n, 0n, false, 0n]
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await readLuckyRoundDisplaySnapshot(USER, client)
  assert.equal(snap.openRoundId, 0n)
  assert.equal(snap.endTimeSec, 0n)
  assert.equal(snap.eligible, false)
  assert.equal(snap.roundPurchaseUsd1, null)
  assert.equal(snap.accepting, false)
  assert.deepEqual(calls, ['getCurrentRoundUserStat'])
})

test('readLuckyRoundDisplaySnapshot keeps qualified false when window is not accepting', async () => {
  const { readLuckyRoundDisplaySnapshot } = await loadModule('/src/web3/rewards/rewards-read.ts')

  const client = {
    async readContract(request) {
      if (request.functionName === 'getCurrentRoundUserStat') {
        return [3n, 1n * 10n ** 18n, false, 0n]
      }
      if (request.functionName === 'getRound') {
        return { endTime: 50n }
      }
      if (request.functionName === 'isRoundAcceptingPurchases') {
        return false
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await readLuckyRoundDisplaySnapshot(USER, client)
  assert.equal(snap.openRoundId, 3n)
  assert.equal(snap.endTimeSec, 50n)
  assert.equal(snap.eligible, false)
  assert.equal(snap.accepting, false)
  assert.equal(snap.roundPurchaseUsd1, 1n * 10n ** 18n)
})
