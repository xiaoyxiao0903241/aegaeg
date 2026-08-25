import assert from 'node:assert/strict'
import test from 'node:test'

import { decodeFunctionData, encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

const USER_A = '0x1111111111111111111111111111111111111111'
const USER_B = '0x2222222222222222222222222222222222222222'

const trackerAbi = parseAbi([
  'function getUserRoundStat(uint256 roundId, address user) view returns (uint256 totalAmount, bool qualified, uint256 qualifiedAt)',
])

function encodeStat(totalAmount) {
  return encodeFunctionResult({
    abi: trackerAbi,
    functionName: 'getUserRoundStat',
    result: [totalAmount, true, 1n],
  })
}

test('readLuckyWinnerRoundStakes multicalls Tracker.getUserRoundStat for at most 10 users', async () => {
  const { readLuckyWinnerRoundStakes } = await loadModule('/src/web3/rewards/rewards-read.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const amounts = {
    [USER_A.toLowerCase()]: 5n * 10n ** 18n,
    [USER_B.toLowerCase()]: 12n * 10n ** 18n,
  }
  const calls = []
  const client = {
    async readContract(request) {
      calls.push({
        fn: request.functionName,
        address: String(request.address).toLowerCase(),
        args: request.args,
      })
      if (request.functionName !== 'aggregate3') {
        throw new Error(`unexpected ${request.functionName}`)
      }
      return request.args[0].map((call) => {
        const decoded = decodeFunctionData({ abi: trackerAbi, data: call.callData })
        assert.equal(decoded.functionName, 'getUserRoundStat')
        assert.equal(decoded.args[0], 7n)
        assert.equal(
          String(call.target).toLowerCase(),
          BSC_CONTRACTS.dailyPurchaseTracker.toLowerCase(),
        )
        const user = String(decoded.args[1]).toLowerCase()
        return {
          success: true,
          returnData: encodeStat(amounts[user] ?? 0n),
        }
      })
    },
  }

  const stakes = await withBscReadClient(client, () =>
    readLuckyWinnerRoundStakes(7n, [USER_A, USER_B]),
  )

  assert.equal(stakes.get(USER_A.toLowerCase()), 5n * 10n ** 18n)
  assert.equal(stakes.get(USER_B.toLowerCase()), 12n * 10n ** 18n)
  assert.equal(calls.length, 1)
  assert.equal(calls[0]?.fn, 'aggregate3')
  assert.equal(calls[0]?.args[0].length, 2)
})

test('readLuckyWinnerRoundStakes skips RPC when roundId is 0 or users empty', async () => {
  const { readLuckyWinnerRoundStakes } = await loadModule('/src/web3/rewards/rewards-read.ts')
  let reads = 0
  const client = {
    async readContract() {
      reads += 1
      throw new Error('unexpected read')
    },
  }

  const emptyRound = await withBscReadClient(client, () => readLuckyWinnerRoundStakes(0n, [USER_A]))
  const emptyUsers = await withBscReadClient(client, () => readLuckyWinnerRoundStakes(7n, []))

  assert.equal(emptyRound.size, 0)
  assert.equal(emptyUsers.size, 0)
  assert.equal(reads, 0)
})

test('readLuckyWinnerRoundStakes caps at 10 unique valid addresses', async () => {
  const { readLuckyWinnerRoundStakes } = await loadModule('/src/web3/rewards/rewards-read.ts')
  const users = Array.from({ length: 12 }, (_, i) => `0x${String(i + 1).padStart(40, '0')}`)
  users.splice(1, 0, users[0], 'not-an-address')

  let callCount = 0
  const client = {
    async readContract(request) {
      if (request.functionName !== 'aggregate3') {
        throw new Error(`unexpected ${request.functionName}`)
      }
      callCount = request.args[0].length
      return request.args[0].map(() => ({
        success: true,
        returnData: encodeStat(10n ** 18n),
      }))
    },
  }

  const stakes = await withBscReadClient(client, () => readLuckyWinnerRoundStakes(3n, users))
  const eleventh = `0x${String(11).padStart(40, '0')}`
  assert.equal(callCount, 10)
  assert.equal(stakes.size, 10)
  assert.equal(stakes.has(eleventh.toLowerCase()), false)
})

test('readLuckyWinnerRoundStakes fails closed when a slot reverts', async () => {
  const { readLuckyWinnerRoundStakes } = await loadModule('/src/web3/rewards/rewards-read.ts')
  const client = {
    async readContract(request) {
      return request.args[0].map((call, index) => {
        if (index === 1) return { success: false, returnData: '0x' }
        return { success: true, returnData: encodeStat(1n) }
      })
    },
  }

  await assert.rejects(
    () => withBscReadClient(client, () => readLuckyWinnerRoundStakes(7n, [USER_A, USER_B])),
    /LUCKY_ROUND_STAKE_MULTICALL_FAILED/,
  )
})

test('readLuckyMyRoundStakes multicalls Tracker.getUserRoundStat per round for one user', async () => {
  const { readLuckyMyRoundStakes } = await loadModule('/src/web3/rewards/rewards-read.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const calls = []
  const client = {
    async readContract(request) {
      calls.push({
        fn: request.functionName,
        address: String(request.address).toLowerCase(),
      })
      return request.args[0].map((call) => {
        const decoded = decodeFunctionData({ abi: trackerAbi, data: call.callData })
        assert.equal(decoded.functionName, 'getUserRoundStat')
        assert.equal(String(decoded.args[1]).toLowerCase(), USER_A.toLowerCase())
        assert.equal(
          String(call.target).toLowerCase(),
          BSC_CONTRACTS.dailyPurchaseTracker.toLowerCase(),
        )
        const roundId = decoded.args[0]
        return {
          success: true,
          returnData: encodeStat(roundId === 7n ? 5n * 10n ** 18n : 2n * 10n ** 18n),
        }
      })
    },
  }

  const stakes = await withBscReadClient(client, () =>
    readLuckyMyRoundStakes(USER_A, [7n, 8n, 7n, 0n]),
  )

  assert.equal(stakes.get(7n), 5n * 10n ** 18n)
  assert.equal(stakes.get(8n), 2n * 10n ** 18n)
  assert.equal(stakes.size, 2)
  assert.equal(calls.length, 1)
  assert.equal(calls[0]?.fn, 'aggregate3')
})

test('readLuckyMyRoundStakes skips RPC when user invalid or rounds empty', async () => {
  const { readLuckyMyRoundStakes } = await loadModule('/src/web3/rewards/rewards-read.ts')
  let reads = 0
  const client = {
    async readContract() {
      reads += 1
      throw new Error('unexpected read')
    },
  }

  const badUser = await withBscReadClient(client, () => readLuckyMyRoundStakes('nope', [7n]))
  const emptyRounds = await withBscReadClient(client, () => readLuckyMyRoundStakes(USER_A, []))

  assert.equal(badUser.size, 0)
  assert.equal(emptyRounds.size, 0)
  assert.equal(reads, 0)
})
