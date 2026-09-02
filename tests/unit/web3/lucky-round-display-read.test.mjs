import assert from 'node:assert/strict'
import test from 'node:test'

import { decodeFunctionData, encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

const USER = '0x1111111111111111111111111111111111111111'

const luckyRoundAbi = parseAbi([
  'function getRound(uint256 roundId) view returns ((uint256 roundId, uint256 displayDay, uint256 startTime, uint256 endTime, uint256 rewardAmount, uint256 rewardPerWinner, uint256 maxWinners, uint256 requestId, uint256 eligibleCount, uint256 winnerCount, uint256 randomRequestBlock, uint8 status))',
  'function isRoundAcceptingPurchases(uint256 roundId) view returns (bool)',
])

function encodeLuckyRoundSlot(functionName, result) {
  return encodeFunctionResult({
    abi: luckyRoundAbi,
    functionName,
    result,
  })
}

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
      if (request.functionName === 'aggregate3') {
        return request.args[0].map((call) => {
          const decoded = decodeFunctionData({ abi: luckyRoundAbi, data: call.callData })
          if (decoded.functionName === 'getRound') {
            return {
              success: true,
              returnData: encodeLuckyRoundSlot('getRound', {
                roundId: 7n,
                displayDay: 0n,
                startTime: 0n,
                endTime: 99n,
                rewardAmount: 0n,
                rewardPerWinner: 0n,
                maxWinners: 0n,
                requestId: 0n,
                eligibleCount: 0n,
                winnerCount: 0n,
                randomRequestBlock: 0n,
                status: 0,
              }),
            }
          }
          if (decoded.functionName === 'isRoundAcceptingPurchases') {
            return {
              success: true,
              returnData: encodeLuckyRoundSlot('isRoundAcceptingPurchases', true),
            }
          }
          throw new Error(`unexpected aggregate3 ${decoded.functionName}`)
        })
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await withBscReadClient(client, () => readLuckyRoundDisplaySnapshot(USER))

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
    ['getCurrentRoundUserStat', 'aggregate3'],
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

  const snap = await withBscReadClient(client, () => readLuckyRoundDisplaySnapshot(USER))
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
      if (request.functionName === 'aggregate3') {
        return request.args[0].map((call) => {
          const decoded = decodeFunctionData({ abi: luckyRoundAbi, data: call.callData })
          if (decoded.functionName === 'getRound') {
            return {
              success: true,
              returnData: encodeLuckyRoundSlot('getRound', {
                roundId: 3n,
                displayDay: 0n,
                startTime: 0n,
                endTime: 50n,
                rewardAmount: 0n,
                rewardPerWinner: 0n,
                maxWinners: 0n,
                requestId: 0n,
                eligibleCount: 0n,
                winnerCount: 0n,
                randomRequestBlock: 0n,
                status: 0,
              }),
            }
          }
          if (decoded.functionName === 'isRoundAcceptingPurchases') {
            return {
              success: true,
              returnData: encodeLuckyRoundSlot('isRoundAcceptingPurchases', false),
            }
          }
          throw new Error(`unexpected aggregate3 ${decoded.functionName}`)
        })
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await withBscReadClient(client, () => readLuckyRoundDisplaySnapshot(USER))
  assert.equal(snap.openRoundId, 3n)
  assert.equal(snap.endTimeSec, 50n)
  assert.equal(snap.eligible, false)
  assert.equal(snap.accepting, false)
  assert.equal(snap.roundPurchaseUsd1, 1n * 10n ** 18n)
})
