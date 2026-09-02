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
      if (request.functionName === 'epoch') {
        return extra?.epoch?.() ?? [8000n, 0n, 0n, 0n]
      }
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

function countingClient(rows, extra) {
  let calls = 0
  const inner = rebaseRowsClient(rows, extra)
  return {
    calls: () => calls,
    client: {
      async readContract(request) {
        calls += 1
        return inner.readContract(request)
      },
    },
  }
}

test('readLatestSagxRebaseRate1e18 returns null on empty rebases array', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  assert.equal(
    await withBscReadClient(rebaseRowsClient(new Map()), () => readLatestSagxRebaseRate1e18()),
    null,
  )
})

test('readLatestSagxRebaseRate1e18 returns last append entry', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const rows = new Map([
    [0n, [0n, 100n, 0n, 0n, 0n, 0n, 0n]],
    [1n, [1n, 250n, 0n, 0n, 0n, 0n, 0n]],
  ])

  const rate = await withBscReadClient(rebaseRowsClient(rows), () => readLatestSagxRebaseRate1e18())
  assert.equal(rate, 250n)
})

test('readLatestSagxRebaseRate1e18 hits epoch.number-1 in one multicall', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const last = 99n
  const rows = new Map()
  for (let i = 0n; i <= last; i += 1n) {
    rows.set(i, [i, 1000n + i, 0n, 0n, 0n, 0n, 0n])
  }

  const { client, calls } = countingClient(rows)
  const hinted = await withBscReadClient(client, () => readLatestSagxRebaseRate1e18(last + 1n))
  assert.equal(hinted, 1000n + last)
  assert.equal(calls(), 1, `hinted lookup used ${calls()} RPCs`)
})

test('readLatestSagxRebaseRate1e18 hits matching epoch.number in one multicall', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const last = 99n
  const rows = new Map()
  for (let i = 0n; i <= last; i += 1n) {
    rows.set(i, [i, 1000n + i, 0n, 0n, 0n, 0n, 0n])
  }

  const { client, calls } = countingClient(rows)
  const hinted = await withBscReadClient(client, () => readLatestSagxRebaseRate1e18(last))
  assert.equal(hinted, 1000n + last)
  assert.equal(calls(), 1, `in-sync hint used ${calls()} RPCs`)
})

test('readLatestSagxRebaseRate1e18 fills the 2^k gap in one parallel round', async () => {
  const { readLatestSagxRebaseRate1e18 } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const last = 99n
  const rows = new Map()
  for (let i = 0n; i <= last; i += 1n) {
    rows.set(i, [i, 1000n + i, 0n, 0n, 0n, 0n, 0n])
  }

  const { client, calls } = countingClient(rows)
  const rate = await withBscReadClient(client, () => readLatestSagxRebaseRate1e18())
  assert.equal(rate, 1000n + last)
  assert.ok(calls() <= 2, `gap fill used ${calls()} RPCs`)
})

test('readLatestSagxRebaseRate returns rate and daily epochs from epoch + hint', async () => {
  const { readLatestSagxRebaseRate } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const last = 99n
  const rows = new Map()
  for (let i = 0n; i <= last; i += 1n) {
    rows.set(i, [i, 1000n + i, 0n, 0n, 0n, 0n, 0n])
  }

  const { client, calls } = countingClient(rows, { epoch: () => [8000n, last, 0n, 0n] })
  const snap = await withBscReadClient(client, () => readLatestSagxRebaseRate())
  assert.equal(snap.rebaseRate1e18, 1000n + last)
  assert.equal(snap.epochsPerDay, 24)
  assert.equal(calls(), 2, `epoch + hint used ${calls()} RPCs`)
})
