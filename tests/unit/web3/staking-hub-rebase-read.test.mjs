import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

test('readLatestSagxRebaseRate1e18 returns null on empty rebases array', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )
  const { ContractFunctionRevertedError } = await import('viem')

  const reverting = {
    async readContract() {
      throw new ContractFunctionRevertedError({
        abi: [],
        args: [0n],
        data: '0x',
        functionName: 'rebases',
      })
    },
  }

  assert.equal(await withBscReadClient(reverting, () => readLatestSagxRebaseRate1e18()), null)
})

test('readLatestSagxRebaseRate1e18 returns last append entry', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )
  const { ContractFunctionRevertedError } = await import('viem')

  const rows = new Map([
    [0n, [0n, 100n, 0n, 0n, 0n, 0n, 0n]],
    [1n, [1n, 250n, 0n, 0n, 0n, 0n, 0n]],
  ])

  const client = {
    async readContract({ args }) {
      const index = args[0]
      const row = rows.get(index)
      if (!row) {
        throw new ContractFunctionRevertedError({
          abi: [],
          args: [index],
          data: '0x',
          functionName: 'rebases',
        })
      }
      return row
    },
  }

  const rate = await withBscReadClient(client, () => readLatestSagxRebaseRate1e18())
  assert.equal(rate, 250n)
})
