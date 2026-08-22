import assert from 'node:assert/strict'
import test from 'node:test'

import { encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

const USER = '0x1111111111111111111111111111111111111111'

test('bscReadRpcUrls dedupes primary and appends public fallbacks', async () => {
  const { bscReadRpcUrls, uniqueRpcUrls } = await loadModule('/src/web3/bsc-read-client.ts')
  assert.deepEqual(uniqueRpcUrls(['https://A', 'https://a', 'https://B']), [
    'https://A',
    'https://B',
  ])
  const urls = bscReadRpcUrls(
    'https://primary.example',
    ['https://fallback.example'],
    ['https://seed1.example', 'https://primary.example'],
  )
  assert.deepEqual(urls, [
    'https://primary.example',
    'https://fallback.example',
    'https://seed1.example',
  ])
})

test('parseOptionalCsvUrls splits comma list', async () => {
  const { parseOptionalCsvUrls } = await loadModule('/src/shared/config/env.ts')
  assert.deepEqual(parseOptionalCsvUrls(''), [])
  assert.deepEqual(parseOptionalCsvUrls(' https://a ,https://b '), ['https://a', 'https://b'])
})

test('readTurbineSilences budgets: size+cooldown + one aggregate3 (not 2N)', async () => {
  const { readTurbineSilences } = await loadModule('/src/web3/exchange/turbine-exchange-read.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const turbineAbi = parseAbi([
    'function silences(address,uint256) view returns (uint256,uint256)',
    'function isVested(address,uint256) view returns (bool)',
  ])
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'silencesSize') return 4n
      if (request.functionName === 'currentCooldownDuration') return 3600n
      if (request.functionName === 'aggregate3') {
        const batch = request.args[0]
        assert.equal(batch.length, 8)
        return batch.map((item, i) => {
          const odd = i % 2 === 1
          if (odd) {
            return {
              success: true,
              returnData: encodeFunctionResult({
                abi: turbineAbi,
                functionName: 'isVested',
                result: i === 3,
              }),
            }
          }
          return {
            success: true,
            returnData: encodeFunctionResult({
              abi: turbineAbi,
              functionName: 'silences',
              result: [100n + BigInt(i), 1n],
            }),
          }
        })
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  // Patch contract address via real config — aggregate3 must hit multicall3.
  assert.equal(typeof BSC_CONTRACTS.turbine, 'string')
  assert.equal(typeof BSC_CONTRACTS.multicall3, 'string')

  const { rows, claimableCount } = await withBscReadClient(client, () => readTurbineSilences(USER))
  assert.equal(rows.length, 4)
  assert.equal(claimableCount, 1)
  assert.deepEqual(calls.sort(), ['aggregate3', 'currentCooldownDuration', 'silencesSize'].sort())
  assert.ok(!calls.includes('silences'))
  assert.ok(!calls.includes('isVested'))
})

test('readReleaseBufferSnapshot budgets: manager head + next + getReleases (+ archive)', async () => {
  const { readReleaseBufferSnapshot } = await loadModule('/src/web3/release/release-read.ts')
  const { AEGIS_SPLITTER_METHODS, PRINCIPAL_RELEASE_VAULT_METHODS } =
    await loadModule('/src/web3/abis.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const splitterAbi = parseAbi([AEGIS_SPLITTER_METHODS.getReleases])
  const archiveAbi = parseAbi([PRINCIPAL_RELEASE_VAULT_METHODS.getRelease])
  const HEAD = '0x1111111111111111111111111111111111111111'
  const ZERO = '0x0000000000000000000000000000000000000000'
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getHeadSplitterForUser') return HEAD
      if (request.functionName === 'next') return ZERO
      if (request.functionName === 'getReleases') {
        assert.deepEqual(request.args.slice(1), [0n, 50n])
        return [
          [
            {
              release: {
                token: BSC_CONTRACTS.agx,
                amount: 10n,
                claimed: 1n,
                startTime: 0n,
                duration: 1n,
              },
              claimableAmount: 2n,
              remainingAmount: 7n,
              endTime: 0n,
              fullyClaimed: false,
            },
            {
              release: {
                token: BSC_CONTRACTS.gagx,
                amount: 5n,
                claimed: 0n,
                startTime: 0n,
                duration: 1n,
              },
              claimableAmount: 1n,
              remainingAmount: 5n,
              endTime: 0n,
              fullyClaimed: false,
            },
          ],
          2n,
        ]
      }
      if (request.functionName === 'getReleaseCount') return 1n
      if (request.functionName === 'aggregate3') {
        assert.equal(request.args[0].length, 1)
        return request.args[0].map(() => ({
          success: true,
          returnData: encodeFunctionResult({
            abi: archiveAbi,
            functionName: 'getRelease',
            result: [{ amount: 3n, claimed: 1n, startTime: 0n, duration: 1n }, 1n, 2n, 0n, false],
          }),
        }))
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await withBscReadClient(client, () => readReleaseBufferSnapshot(USER))
  assert.equal(snap.splitterCount, 2)
  assert.equal(snap.chain.length, 1)
  assert.equal(snap.chain[0].isTail, true)
  assert.equal(snap.chain[0].claimable, 3n)
  assert.ok(!('claimWindows' in snap.chain[0]))
  assert.deepEqual(snap.chain[0].agxClaimIndexes, [0])
  assert.deepEqual(snap.chain[0].gagxClaimIndexes, [1])
  assert.equal(snap.archiveCount, 1)
  assert.deepEqual(snap.archiveClaimWindows, [{ start: 0, limit: 1 }])
  assert.equal(snap.agx.totalClaimable, 3n) // 2 splitter + 1 archive
  assert.equal(snap.gagx.totalClaimable, 1n)
  assert.equal(snap.totalClaimable, 4n)
  assert.equal(snap.totalAmount, undefined)
  assert.ok(calls.includes('getHeadSplitterForUser'))
  assert.ok(calls.includes('next'))
  assert.ok(calls.includes('getReleases'))
  assert.ok(!calls.includes('getRelease'))
  void splitterAbi
})

test('readReleaseBufferSnapshot walks next chain and merges hop claimables', async () => {
  const { readReleaseBufferSnapshot } = await loadModule('/src/web3/release/release-read.ts')
  const { PRINCIPAL_RELEASE_VAULT_METHODS } = await loadModule('/src/web3/abis.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const archiveAbi = parseAbi([PRINCIPAL_RELEASE_VAULT_METHODS.getRelease])
  const HEAD = '0x1111111111111111111111111111111111111111'
  const MID = '0x2222222222222222222222222222222222222222'
  const ZERO = '0x0000000000000000000000000000000000000000'
  const client = {
    async readContract(request) {
      if (request.functionName === 'getHeadSplitterForUser') return HEAD
      if (request.functionName === 'next') {
        if (request.address === HEAD) return MID
        return ZERO
      }
      if (request.functionName === 'getReleases') {
        const claimable = request.address === HEAD ? 4n : 5n
        return [
          [
            {
              release: {
                token: BSC_CONTRACTS.agx,
                amount: claimable,
                claimed: 0n,
                startTime: 0n,
                duration: 1n,
              },
              claimableAmount: claimable,
              remainingAmount: claimable,
              endTime: 0n,
              fullyClaimed: false,
            },
          ],
          1n,
        ]
      }
      if (request.functionName === 'getReleaseCount') return 0n
      if (request.functionName === 'aggregate3') {
        return []
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await withBscReadClient(client, () => readReleaseBufferSnapshot(USER))
  assert.equal(snap.chain.length, 2)
  assert.equal(snap.chain[0].address, HEAD)
  assert.equal(snap.chain[0].isTail, false)
  assert.equal(snap.chain[0].claimable, 4n)
  assert.equal(snap.chain[1].address, MID)
  assert.equal(snap.chain[1].isTail, true)
  assert.equal(snap.chain[1].claimable, 5n)
  assert.ok(!('claimWindows' in snap.chain[0]))
  assert.ok(!('claimWindows' in snap.chain[1]))
  assert.equal(snap.splitterClaimable, 9n)
  assert.equal(snap.agx.totalClaimable, 9n)
  assert.deepEqual(snap.archiveClaimWindows, [])
  void archiveAbi
})

test('claimWindowsFromAmounts skips empty pages', async () => {
  const { claimWindowsFromAmounts } = await loadModule('/src/web3/release/release-read.ts')
  assert.deepEqual(claimWindowsFromAmounts([]), [])
  assert.deepEqual(claimWindowsFromAmounts([0n, 0n, 1n, 0n], 2), [{ start: 2, limit: 2 }])
  assert.deepEqual(claimWindowsFromAmounts([1n, 0n, 0n, 0n, 2n], 2), [
    { start: 0, limit: 2 },
    { start: 4, limit: 1 },
  ])
  assert.deepEqual(claimWindowsFromAmounts([0n, 0n, 0n], 50), [])
})

test('claimIndexesForToken only keeps matching claimable indexes', async () => {
  const { claimIndexesForToken } = await loadModule('/src/web3/release/release-read.ts')
  const agx = '0x1111111111111111111111111111111111111111'
  const gagx = '0x2222222222222222222222222222222222222222'
  const items = [
    { release: { token: agx }, claimableAmount: 1n },
    { release: { token: gagx }, claimableAmount: 2n },
    { release: { token: agx }, claimableAmount: 0n },
    { release: { token: agx }, claimableAmount: 3n },
  ]
  assert.deepEqual(claimIndexesForToken(items, agx), [0, 3])
  assert.deepEqual(claimIndexesForToken(items, gagx), [1])
})

test('readReleaseBufferSnapshot archive: count fail soft; page fail closed', async () => {
  const { readReleaseBufferSnapshot } = await loadModule('/src/web3/release/release-read.ts')
  const ZERO = '0x0000000000000000000000000000000000000000'

  const soft = await withBscReadClient(
    {
      async readContract(request) {
        if (request.functionName === 'getHeadSplitterForUser') return ZERO
        if (request.functionName === 'getReleaseCount') throw new Error('archive down')
        throw new Error(`unexpected ${request.functionName}`)
      },
    },
    () => readReleaseBufferSnapshot(USER),
  )
  assert.equal(soft.archiveCount, 0)
  assert.equal(soft.totalClaimable, 0n)

  await assert.rejects(
    () =>
      withBscReadClient(
        {
          async readContract(request) {
            if (request.functionName === 'getHeadSplitterForUser') return ZERO
            if (request.functionName === 'getReleaseCount') return 1n
            if (request.functionName === 'aggregate3') {
              return [{ success: false, returnData: '0x' }]
            }
            throw new Error(`unexpected ${request.functionName}`)
          },
        },
        () => readReleaseBufferSnapshot(USER),
      ),
    /RELEASE_ARCHIVE_MULTICALL_FAILED/,
  )
})

test('readStakePositions locked: count + getStakes + aggregate3 (not N getStake)', async () => {
  const { readStakePositions } = await loadModule('/src/web3/assets/assets-read.ts')
  const { LOCKED_STAKING_ASSETS_METHODS } = await loadModule('/src/web3/abis.ts')
  const lockedAbi = parseAbi([
    LOCKED_STAKING_ASSETS_METHODS.getStakes,
    LOCKED_STAKING_ASSETS_METHODS.getReleasedPrincipal,
  ])
  const ZERO = '0x0000000000000000000000000000000000000000'
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'migratedFrom') return ZERO
      if (request.functionName === 'stakes') return [0n, 0n, 0n, 0n, false]
      if (request.functionName === 'warmupStakes') return [0n, 0n, 0n, 0n, false]
      if (request.functionName === 'getStakeRewards') return [0n, 0n]
      if (request.functionName === 'isWarmupExpired') return true
      if (request.functionName === 'getStakesCount') {
        // 仅第一个 locked 池有仓；其余 0 跳过 getStakes（手册空列表勿调）。
        return calls.filter((name) => name === 'getStakesCount').length === 1 ? 3n : 0n
      }
      if (request.functionName === 'getStakes') {
        assert.deepEqual(request.args.slice(1), [0n, 3n])
        return [
          {
            pending: 10n,
            blockReward: 1n,
            extraInterest: 0n,
            claimableBalance: 0n,
            expiry: 1n,
          },
          {
            pending: 0n,
            blockReward: 0n,
            extraInterest: 0n,
            claimableBalance: 0n,
            expiry: 0n,
          },
          {
            pending: 20n,
            blockReward: 2n,
            extraInterest: 0n,
            claimableBalance: 0n,
            expiry: 2n,
          },
        ]
      }
      if (request.functionName === 'aggregate3') {
        assert.equal(request.args[0].length, 3)
        return request.args[0].map((_, i) => ({
          success: true,
          returnData: encodeFunctionResult({
            abi: lockedAbi,
            functionName: 'getReleasedPrincipal',
            result: BigInt(i + 1),
          }),
        }))
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const rows = await withBscReadClient(client, () => readStakePositions(USER))
  assert.equal(rows.length, 2)
  assert.equal(rows[0].releasedPrincipal, 1n)
  assert.equal(rows[1].releasedPrincipal, 3n)
  assert.ok(calls.includes('getStakes'))
  assert.ok(calls.includes('aggregate3'))
  assert.ok(!calls.includes('getStake'))
  assert.equal(calls.filter((name) => name === 'getStakes').length, 1)
  assert.equal(calls.filter((name) => name === 'aggregate3').length, 1)
})

test('readLpBondPositions: getBondCount + one aggregate3 per non-empty pool (not 3N)', async () => {
  const { readLpBondPositions } = await loadModule('/src/web3/assets/assets-read.ts')
  const { BOND_DEPOSITORY_ASSETS_METHODS } = await loadModule('/src/web3/abis.ts')
  const bondAbi = parseAbi([
    BOND_DEPOSITORY_ASSETS_METHODS.getBondInfo,
    BOND_DEPOSITORY_ASSETS_METHODS.pendingPayoutFor,
    BOND_DEPOSITORY_ASSETS_METHODS.getStakeProfit,
  ])
  const calls = []
  let bondCountCalls = 0
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getBondCount') {
        bondCountCalls += 1
        return bondCountCalls === 1 ? 2n : 0n
      }
      if (request.functionName === 'aggregate3') {
        assert.equal(request.args[0].length, 6)
        const out = []
        for (let i = 0; i < 2; i += 1) {
          out.push(
            {
              success: true,
              returnData: encodeFunctionResult({
                abi: bondAbi,
                functionName: 'getBondInfo',
                result: [0n, 0n, 0n, 0n, true, 0n, 50n + BigInt(i), 9n, 0n, 0n],
              }),
            },
            {
              success: true,
              returnData: encodeFunctionResult({
                abi: bondAbi,
                functionName: 'pendingPayoutFor',
                result: 3n + BigInt(i),
              }),
            },
            {
              success: true,
              returnData: encodeFunctionResult({
                abi: bondAbi,
                functionName: 'getStakeProfit',
                result: 7n + BigInt(i),
              }),
            },
          )
        }
        return out
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const rows = await withBscReadClient(client, () => readLpBondPositions(USER))
  assert.equal(rows.length, 2)
  assert.equal(rows[0].pendingPayout, 3n)
  assert.equal(rows[1].profit, 8n)
  assert.equal(calls.filter((name) => name === 'aggregate3').length, 1)
  assert.ok(!calls.includes('getBondInfo'))
  assert.ok(!calls.includes('pendingPayoutFor'))
  assert.ok(!calls.includes('getStakeProfit'))
})
