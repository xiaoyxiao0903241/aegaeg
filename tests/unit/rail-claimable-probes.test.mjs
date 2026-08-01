import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const USER = '0x1111111111111111111111111111111111111111'

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

test('readReleaseHasClaimable uses queue total then vault claimable short-circuit', async () => {
  const { readReleaseHasClaimable } = await loadModule('/src/web3/release/release-read.ts')
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getUserTotalClaimable') return 0n
      if (request.functionName === 'getReleaseCount') return 4n
      if (request.functionName === 'claimable') {
        return request.args?.[1] === 2n ? 7n : 0n
      }
      if (request.functionName === 'getRelease') {
        throw new Error('probe must not scan getRelease snapshot')
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  assert.equal(await readReleaseHasClaimable(USER, client), true)
  assert.deepEqual(calls, [
    'getUserTotalClaimable',
    'getReleaseCount',
    'claimable',
    'claimable',
    'claimable',
  ])
})
