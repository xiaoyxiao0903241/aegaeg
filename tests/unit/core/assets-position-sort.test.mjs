import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const clock = {
  currentEpoch: 10n,
  epochEndBlock: 140n,
  currentBlock: 100n,
  epochLengthBlocks: 100n,
  secondsPerBlock: 2,
}

test('locked sort uses expiry remaining and expiry minus periodTime', async () => {
  const { assetsStakeSortTimes } = await loadModule('/src/core/assets/assets-position-sort.ts')
  const nowSec = 1_787_971_000
  const periodTime = 180 * 86_400
  const row = {
    id: 'locked-180-0',
    kind: 'locked',
    expiry: BigInt(nowSec + 800),
    periodTime: BigInt(periodTime),
  }

  assert.deepEqual(assetsStakeSortTimes(row, nowSec, clock), {
    startAt: nowSec + 800 - periodTime,
    remaining: 800,
  })
})

test('early sort uses unix expiry like locked', async () => {
  const { assetsStakeSortTimes } = await loadModule('/src/core/assets/assets-position-sort.ts')
  const nowSec = 1_787_971_000
  const periodTime = 360 * 86_400
  const row = {
    id: 'early',
    kind: 'early',
    expiry: BigInt(nowSec + 800),
    periodTime: BigInt(periodTime),
  }

  assert.deepEqual(assetsStakeSortTimes(row, nowSec, clock), {
    startAt: nowSec + 800 - periodTime,
    remaining: 800,
  })
})

test('locked expiry 0 is unknown, not infinite', async () => {
  const { assetsStakeSortTimes } = await loadModule('/src/core/assets/assets-position-sort.ts')
  const row = { id: 'locked-180-0', kind: 'locked', expiry: 0n, periodTime: 100n }

  assert.deepEqual(assetsStakeSortTimes(row, 50, clock), { startAt: null, remaining: null })
})

test('bond sort uses vestingEnd minus vestingTerm', async () => {
  const { assetsBondSortTimes } = await loadModule('/src/core/assets/assets-position-sort.ts')

  assert.deepEqual(
    assetsBondSortTimes({ id: 'lp-180-0', vestingEndTime: 500n, vestingTerm: 200n }, 400),
    { startAt: 300, remaining: 100 },
  )
  assert.deepEqual(
    assetsBondSortTimes({ id: 'lp-180-1', vestingEndTime: 0n, vestingTerm: 200n }, 400),
    { startAt: null, remaining: null },
  )
})

test('liquid active remaining is 0; start from startEpoch', async () => {
  const { assetsStakeSortTimes } = await loadModule('/src/core/assets/assets-position-sort.ts')
  const nowSec = 1_000_000
  const row = {
    id: 'liquid',
    kind: 'liquid',
    expiry: 9n,
    startEpoch: 8n,
  }

  // elapsedEpochs=2, blocksIntoCurrent=60, sec=2 → 520s ago
  assert.deepEqual(assetsStakeSortTimes(row, nowSec, clock), {
    startAt: 999_480,
    remaining: 0,
  })
})

test('liquid warmup remaining uses expiry epoch, not unix', async () => {
  const { assetsStakeSortTimes } = await loadModule('/src/core/assets/assets-position-sort.ts')
  const nowSec = 1_000_000
  const row = {
    id: 'liquid-warmup',
    kind: 'liquid',
    inWarmup: true,
    warmupExpired: false,
    expiry: 12n,
    startEpoch: 10n,
  }

  assert.deepEqual(assetsStakeSortTimes(row, nowSec, clock), {
    startAt: 999_880,
    remaining: 280,
  })
})

test('compare: newest start and shortest remaining first; nulls last', async () => {
  const { compareAssetsPositionSort } = await loadModule('/src/core/assets/assets-position-sort.ts')
  const newer = { startAt: 200, remaining: 50 }
  const older = { startAt: 100, remaining: 10 }
  const unknown = { startAt: null, remaining: null }

  assert.ok(compareAssetsPositionSort(newer, older, 'startNear', 'a', 'b') < 0)
  assert.ok(compareAssetsPositionSort(newer, older, 'startFar', 'a', 'b') > 0)
  assert.ok(compareAssetsPositionSort(older, newer, 'endNear', 'a', 'b') < 0)
  assert.ok(compareAssetsPositionSort(unknown, older, 'endNear', 'a', 'b') > 0)
  assert.ok(compareAssetsPositionSort(unknown, older, 'startNear', 'a', 'b') > 0)
})
