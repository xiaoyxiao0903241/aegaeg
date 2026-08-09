import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('refetchStaleTabQueries uses active+stale; prefetch uses inactive+stale', async () => {
  const invalidateMod = await loadModule('/src/shared/api/query/invalidate.ts')
  const prefetchMod = await loadModule('/src/shared/api/query/prefetch.ts')
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')

  const calls = []
  const original = queryClient.refetchQueries.bind(queryClient)
  queryClient.refetchQueries = (filters) => {
    calls.push(filters)
    return Promise.resolve([])
  }

  try {
    invalidateMod.refetchStaleTabQueries('exchange')
    assert.ok(calls.length > 0)
    for (const filters of calls) {
      assert.equal(filters.type, 'active')
      assert.equal(filters.stale, true)
    }

    calls.length = 0
    prefetchMod.prefetchTabQueries('staking')
    assert.ok(calls.length > 0)
    for (const filters of calls) {
      assert.equal(filters.type, 'inactive')
      assert.equal(filters.stale, true)
    }
  } finally {
    queryClient.refetchQueries = original
  }
})

test('dapp-host must not invalidate whole tab on displayTab change', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../../src/views/dapp/host/dapp-host.tsx', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(src, /invalidateTabQueries\(displayTab\)/)
})

test('genesis promo chrome must not re-subscribe seasonOptions/promoSnapshot', async () => {
  const { readFile } = await import('node:fs/promises')
  const hook = await readFile(
    new URL('../../../src/hooks/use-genesis-promo.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(hook, /state\.seasonOptions/)
  assert.doesNotMatch(hook, /state\.promoSnapshot/)
})

test('xmine parent/card must not own 1Hz setInterval', async () => {
  const { readFile } = await import('node:fs/promises')
  const parent = await readFile(
    new URL('../../../src/views/dapp/assets/xmine/use-xmine.ts', import.meta.url),
    'utf8',
  )
  const card = await readFile(
    new URL('../../../src/views/dapp/assets/xmine/primitives.tsx', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(parent, /setInterval/)
  assert.doesNotMatch(card, /setInterval/)
})

test('genesis chain-reads must not tick wall clock', async () => {
  const { readFile } = await import('node:fs/promises')
  const reads = await readFile(
    new URL('../../../src/views/dapp/genesis/use-genesis-chain-reads.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(reads, /useWallClockSec/)
})

test('exchange Detail files must not reference retired sellAmount', async () => {
  const { readFile } = await import('node:fs/promises')
  const files = [
    '../../../src/views/dapp/exchange/market-trade/detail.tsx',
    '../../../src/views/dapp/exchange/flash-exchange/detail.tsx',
    '../../../src/views/dapp/exchange/burn/detail.tsx',
    '../../../src/views/dapp/exchange/turbine/detail.tsx',
  ]
  for (const rel of files) {
    const src = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.doesNotMatch(src, /sellAmount/, `${rel} must not reference sellAmount`)
  }
})
