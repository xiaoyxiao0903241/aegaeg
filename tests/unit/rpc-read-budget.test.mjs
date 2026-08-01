import assert from 'node:assert/strict'
import test from 'node:test'

import { encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from './load-module.mjs'

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

  const { rows, claimableCount } = await readTurbineSilences(USER, client)
  assert.equal(rows.length, 4)
  assert.equal(claimableCount, 1)
  assert.deepEqual(calls.sort(), ['aggregate3', 'currentCooldownDuration', 'silencesSize'].sort())
  assert.ok(!calls.includes('silences'))
  assert.ok(!calls.includes('isVested'))
})

test('readReleaseBufferSnapshot budgets: count + one aggregate3 (not N)', async () => {
  const { readReleaseBufferSnapshot } = await loadModule('/src/web3/release/release-read.ts')
  const { PRINCIPAL_RELEASE_VAULT_METHODS } = await loadModule('/src/web3/abis.ts')
  const vaultAbi = parseAbi([PRINCIPAL_RELEASE_VAULT_METHODS.getRelease])
  const calls = []
  const client = {
    async readContract(request) {
      calls.push(request.functionName)
      if (request.functionName === 'getReleaseCount') return 3n
      if (request.functionName === 'aggregate3') {
        assert.equal(request.args[0].length, 3)
        return request.args[0].map(() => ({
          success: true,
          returnData: encodeFunctionResult({
            abi: vaultAbi,
            functionName: 'getRelease',
            result: [{ amount: 10n, claimed: 1n, startTime: 0n, duration: 1n }, 2n, 7n, 0n, false],
          }),
        }))
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }

  const snap = await readReleaseBufferSnapshot(USER, client)
  assert.equal(snap.count, 3)
  assert.equal(snap.totalClaimable, 6n)
  assert.deepEqual(calls.sort(), ['aggregate3', 'getReleaseCount'].sort())
  assert.ok(!calls.includes('getRelease'))
})
