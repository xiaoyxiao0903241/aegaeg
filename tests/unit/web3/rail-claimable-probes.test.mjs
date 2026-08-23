import assert from 'node:assert/strict'
import test from 'node:test'

import { encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

const USER = '0x1111111111111111111111111111111111111111'

const vestedAbi = parseAbi(['function isVested(address,uint256) view returns (bool)'])

test('readTurbineClaimableFingerprint lists all vested indices (no silences body)', async () => {
  const { readTurbineClaimableFingerprint } = await loadModule(
    '/src/web3/exchange/turbine-exchange-read.ts',
  )
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'silencesSize') return 4n
      if (request.functionName === 'aggregate3') {
        return request.args[0].map((call, i) => ({
          success: true,
          returnData: encodeFunctionResult({
            abi: vestedAbi,
            functionName: 'isVested',
            result: i === 1 || i === 3,
          }),
        }))
      }
      if (request.functionName === 'isVested' || request.functionName === 'silences') {
        throw new Error('probe must not read silences/isVested one-by-one')
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  assert.equal(await withBscReadClient(client, () => readTurbineClaimableFingerprint(USER)), '1|3')
  assert.deepEqual(calls, ['silencesSize', 'aggregate3'])
})

test('readTurbineClaimableFingerprint is empty when none vested', async () => {
  const { readTurbineClaimableFingerprint } = await loadModule(
    '/src/web3/exchange/turbine-exchange-read.ts',
  )
  let vestedCalls = 0
  const client = {
    async readContract(request) {
      if (request.functionName === 'silencesSize') return 3n
      if (request.functionName === 'aggregate3') {
        vestedCalls += request.args[0].length
        return request.args[0].map(() => ({
          success: true,
          returnData: encodeFunctionResult({
            abi: vestedAbi,
            functionName: 'isVested',
            result: false,
          }),
        }))
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }
  assert.equal(await withBscReadClient(client, () => readTurbineClaimableFingerprint(USER)), '')
  assert.equal(vestedCalls, 3)
})
