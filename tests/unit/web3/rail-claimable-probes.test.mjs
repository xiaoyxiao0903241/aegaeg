import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const USER = '0x1111111111111111111111111111111111111111'
const ZERO = '0x0000000000000000000000000000000000000000'
const HEAD = '0x1111111111111111111111111111111111111111'

test('readTurbineHasClaimable short-circuits on first vested (no silences body)', async () => {
  const { readTurbineHasClaimable } = await loadModule(
    '/src/web3/exchange/turbine-exchange-read.ts',
  )
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'silencesSize') return 5n
      if (request.functionName === 'isVested') {
        return request.args?.[1] === 1n
      }
      if (request.functionName === 'silences') {
        throw new Error('probe must not read silences body')
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  assert.equal(await readTurbineHasClaimable(USER, client), true)
  assert.deepEqual(calls, ['silencesSize', 'isVested', 'isVested'])
})

test('readTurbineHasClaimable returns false when none vested', async () => {
  const { readTurbineHasClaimable } = await loadModule(
    '/src/web3/exchange/turbine-exchange-read.ts',
  )
  let vestedCalls = 0
  const client = {
    async readContract(request) {
      if (request.functionName === 'silencesSize') return 3n
      if (request.functionName === 'isVested') {
        vestedCalls += 1
        return false
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }
  assert.equal(await readTurbineHasClaimable(USER, client), false)
  assert.equal(vestedCalls, 3)
})

test('readReleaseHasClaimable: no splitter → archive claimable short-circuit', async () => {
  const { readReleaseHasClaimable } = await loadModule('/src/web3/release/release-read.ts')
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getUserTotalClaimable') return 0n
      if (request.functionName === 'getHeadSplitterForUser') return ZERO
      if (request.functionName === 'getReleaseCount') return 4n
      if (request.functionName === 'claimable') {
        return request.args?.[1] === 2n ? 7n : 0n
      }
      if (request.functionName === 'getRelease' || request.functionName === 'getReleases') {
        throw new Error('archive probe must not scan full release snapshot')
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  assert.equal(await readReleaseHasClaimable(USER, client), true)
  assert.deepEqual(calls, [
    'getUserTotalClaimable',
    'getHeadSplitterForUser',
    'getReleaseCount',
    'claimable',
    'claimable',
    'claimable',
  ])
})

test('readReleaseHasClaimable: splitter hop uses getReleases (not N claimable)', async () => {
  const { readReleaseHasClaimable } = await loadModule('/src/web3/release/release-read.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getUserTotalClaimable') return 0n
      if (request.functionName === 'getHeadSplitterForUser') return HEAD
      if (request.functionName === 'next') return ZERO
      if (request.functionName === 'getReleases') {
        return [
          [
            {
              release: {
                token: BSC_CONTRACTS.agx,
                amount: 1n,
                claimed: 0n,
                startTime: 0n,
                duration: 1n,
              },
              claimableAmount: 1n,
              remainingAmount: 1n,
              endTime: 0n,
              fullyClaimed: false,
            },
          ],
          1n,
        ]
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  assert.equal(await readReleaseHasClaimable(USER, client), true)
  assert.ok(calls.includes('getHeadSplitterForUser'))
  assert.ok(calls.includes('getReleases'))
  assert.ok(!calls.includes('claimable'))
})

test('readReleaseHasClaimable returns false when queue and vault empty', async () => {
  const { readReleaseHasClaimable } = await loadModule('/src/web3/release/release-read.ts')
  const client = {
    async readContract(request) {
      if (request.functionName === 'getUserTotalClaimable') return 0n
      if (request.functionName === 'getHeadSplitterForUser') return ZERO
      if (request.functionName === 'getReleaseCount') return 2n
      if (request.functionName === 'claimable') return 0n
      throw new Error(`unexpected ${request.functionName}`)
    },
  }
  assert.equal(await readReleaseHasClaimable(USER, client), false)
})
