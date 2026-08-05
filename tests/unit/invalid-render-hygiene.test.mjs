import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

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

test('dapp-host displayTab uses refetchStaleTabQueries not invalidateTabQueries', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../src/views/dapp/host/dapp-host.tsx', import.meta.url),
    'utf8',
  )
  assert.match(src, /refetchStaleTabQueries\(displayTab\)/)
  assert.doesNotMatch(src, /invalidateTabQueries\(displayTab\)/)
})

test('rail and community subscribe via useGenesisPromoChrome only', async () => {
  const { readFile } = await import('node:fs/promises')
  const rail = await readFile(
    new URL('../../src/views/dapp/host/rail.tsx', import.meta.url),
    'utf8',
  )
  const community = await readFile(
    new URL('../../src/views/dapp/community/detail.tsx', import.meta.url),
    'utf8',
  )
  const hook = await readFile(
    new URL('../../src/hooks/use-genesis-promo.ts', import.meta.url),
    'utf8',
  )
  assert.match(rail, /useGenesisPromoChrome/)
  assert.match(community, /useGenesisPromoChrome/)
  assert.doesNotMatch(hook, /state\.seasonOptions/)
  assert.doesNotMatch(hook, /state\.promoSnapshot/)
})

test('xmine parent view has no 1Hz interval; position card owns warmup clock', async () => {
  const { readFile } = await import('node:fs/promises')
  const parent = await readFile(
    new URL('../../src/views/dapp/assets/xmine/use-xmine.tsx', import.meta.url),
    'utf8',
  )
  const card = await readFile(
    new URL('../../src/views/dapp/assets/xmine/primitives.tsx', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(parent, /setInterval/)
  assert.match(card, /setInterval\(tick,\s*1000\)/)
})

test('genesis countdown clock owns nowSeconds; chain-reads does not', async () => {
  const { readFile } = await import('node:fs/promises')
  const reads = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-chain-reads.ts', import.meta.url),
    'utf8',
  )
  const clock = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-countdown-clock.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(reads, /nowSeconds/)
  assert.match(clock, /state\.nowSeconds/)
  assert.match(clock, /invalidateAfterGenesisPhaseTransition/)
})

test('carousel provider value is memoized', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../src/shared/components/carousel.tsx', import.meta.url),
    'utf8',
  )
  assert.match(src, /useMemo/)
  assert.match(src, /contextValue/)
})

test('exchange Detail files do not reference sellAmount', async () => {
  const { readFile } = await import('node:fs/promises')
  const files = [
    '../../src/views/dapp/exchange/market-trade/detail.tsx',
    '../../src/views/dapp/exchange/flash-exchange/detail.tsx',
    '../../src/views/dapp/exchange/burn/detail.tsx',
    '../../src/views/dapp/exchange/turbine/detail.tsx',
  ]
  for (const rel of files) {
    const src = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.doesNotMatch(src, /sellAmount/, `${rel} must not reference sellAmount`)
  }
  const detail = await readFile(
    new URL('../../src/views/dapp/exchange/detail.tsx', import.meta.url),
    'utf8',
  )
  assert.match(detail, /exchangePriceLabel=\{session\.exchangePriceLabel\}/)
  assert.match(detail, /overviewRateLabel=\{session\.overviewRateLabel\}/)
})
