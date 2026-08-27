import assert from 'node:assert/strict'
import test from 'node:test'

import { parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { withAggregate3, withBscReadClient } from './_bsc-read-client-test.mjs'

const REBASES_ABI = parseAbi([
  'function rebases(uint256 epoch) view returns (uint256 epoch_, uint256 rebase, uint256 totalStakedBefore, uint256 totalStakedAfter, uint256 amountRebased, uint256 index, uint256 blockNumberOccured)',
])

async function revertedRebase(index) {
  const { ContractFunctionRevertedError } = await import('viem')
  throw new ContractFunctionRevertedError({
    abi: [],
    args: [index],
    data: '0x',
    functionName: 'rebases',
  })
}

function rebaseRowsClient(rows, extra) {
  return {
    async readContract(request) {
      return withAggregate3(async ({ functionName, args }) => {
        if (extra?.[functionName]) return extra[functionName](args)
        const index = args[0]
        const row = rows.get(index)
        if (!row) return revertedRebase(index)
        return row
      }, REBASES_ABI)(request)
    },
  }
}

test('readLatestSagxRebaseRate1e18 returns null on empty rebases array', async () => {
  const { clearLatestSagxRebaseIndexCache, readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )
  clearLatestSagxRebaseIndexCache()

  assert.equal(
    await withBscReadClient(rebaseRowsClient(new Map()), () => readLatestSagxRebaseRate1e18()),
    null,
  )
})

test('readLatestSagxRebaseRate1e18 returns last append entry', async () => {
  const { clearLatestSagxRebaseIndexCache, readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )
  clearLatestSagxRebaseIndexCache()

  const rows = new Map([
    [0n, [0n, 100n, 0n, 0n, 0n, 0n, 0n]],
    [1n, [1n, 250n, 0n, 0n, 0n, 0n, 0n]],
  ])

  const rate = await withBscReadClient(rebaseRowsClient(rows), () => readLatestSagxRebaseRate1e18())
  assert.equal(rate, 250n)
})

test('readLatestSagxRebaseRate1e18 hits epoch.number-1 in one multicall', async () => {
  const { clearLatestSagxRebaseIndexCache, readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const last = 99n
  const rows = new Map()
  for (let i = 0n; i <= last; i += 1n) {
    rows.set(i, [i, 1000n + i, 0n, 0n, 0n, 0n, 0n])
  }

  let calls = 0
  const client = {
    async readContract(request) {
      calls += 1
      return rebaseRowsClient(rows).readContract(request)
    },
  }

  clearLatestSagxRebaseIndexCache()
  const hinted = await withBscReadClient(client, () => readLatestSagxRebaseRate1e18(last + 1n))
  assert.equal(hinted, 1000n + last)
  assert.equal(calls, 1, `hinted lookup used ${calls} RPCs`)
})

test('readLatestSagxRebaseRate1e18 fills the 2^k gap in one parallel round', async () => {
  const { clearLatestSagxRebaseIndexCache, readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const last = 99n
  const rows = new Map()
  for (let i = 0n; i <= last; i += 1n) {
    rows.set(i, [i, 1000n + i, 0n, 0n, 0n, 0n, 0n])
  }

  let calls = 0
  const client = {
    async readContract(request) {
      calls += 1
      return rebaseRowsClient(rows).readContract(request)
    },
  }

  clearLatestSagxRebaseIndexCache()
  const rate = await withBscReadClient(client, () => readLatestSagxRebaseRate1e18())
  assert.equal(rate, 1000n + last)
  assert.ok(calls <= 2, `gap fill used ${calls} RPCs`)
})
