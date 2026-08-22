import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

const USER = '0x1111111111111111111111111111111111111111'

test('readTurbineClaimableFingerprint lists all vested indices (no silences body)', async () => {
  const { readTurbineClaimableFingerprint } = await loadModule(
    '/src/web3/exchange/turbine-exchange-read.ts',
  )
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'silencesSize') return 4n
      if (request.functionName === 'isVested') {
        return request.args?.[1] === 1n || request.args?.[1] === 3n
      }
      if (request.functionName === 'silences') {
        throw new Error('probe must not read silences body')
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  assert.equal(await withBscReadClient(client, () => readTurbineClaimableFingerprint(USER)), '1|3')
  assert.deepEqual(calls, ['silencesSize', 'isVested', 'isVested', 'isVested', 'isVested'])
})

test('readTurbineClaimableFingerprint is empty when none vested', async () => {
  const { readTurbineClaimableFingerprint } = await loadModule(
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
  assert.equal(await withBscReadClient(client, () => readTurbineClaimableFingerprint(USER)), '')
  assert.equal(vestedCalls, 3)
})
