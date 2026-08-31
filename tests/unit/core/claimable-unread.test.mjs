import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isUnread: empty never lights; new pot lights; same pot stays dark', async () => {
  const { isUnread } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(isUnread('', null), false)
  assert.equal(isUnread('', 'A'), false)
  assert.equal(isUnread('A', null), true)
  assert.equal(isUnread('A', ''), true)
  assert.equal(isUnread('A', 'A'), false)
  assert.equal(isUnread('B', 'A'), true)
})

test('claim-to-0 then new pot: focused empty write then new identity lights', async () => {
  const { isUnread } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(isUnread('A', 'A'), false)
  assert.equal(isUnread('', 'A'), false)
  assert.equal(isUnread('C', ''), true)
  assert.equal(isUnread('C', 'A'), true)
})

test('fingerprintIdList sorts unique ids; empty list is empty', async () => {
  const { fingerprintIdList } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(fingerprintIdList([]), '')
  assert.equal(fingerprintIdList(['3', '1', '1']), '1|3')
})

test('fingerprintReleaseQueue uses claimable plan identity, not claimable wei', async () => {
  const { fingerprintReleaseQueue } = await loadModule('/src/core/claimable-unread.ts')

  const plans = [
    { planIndex: 0, total: 100n, claimable: 0n },
    { planIndex: 1, total: 50n, claimable: 10n },
  ]
  assert.equal(fingerprintReleaseQueue(plans), '1:50')
  assert.equal(fingerprintReleaseQueue([{ planIndex: 1, total: 50n, claimable: 40n }]), '1:50')
  assert.equal(fingerprintReleaseQueue([{ planIndex: 1, total: 50n, claimable: 0n }]), '')
})

test('fingerprintReleaseBuffer ignores drip; empty when nothing claimable', async () => {
  const { fingerprintReleaseBuffer } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(
    fingerprintReleaseBuffer({
      agxClaimable: 0n,
      gagxClaimable: 0n,
      agxAmount: 80n,
      gagxAmount: 20n,
    }),
    '',
  )
  const pot = {
    agxClaimable: 1n,
    gagxClaimable: 0n,
    agxAmount: 80n,
    gagxAmount: 20n,
  }
  assert.equal(fingerprintReleaseBuffer(pot), '80|20')
  assert.equal(fingerprintReleaseBuffer({ ...pot, agxClaimable: 9n }), '80|20')
})

test('fingerprintLucky uses total unclaimed while claimable', async () => {
  const { fingerprintLucky } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(
    fingerprintLucky({
      claimable: true,
      totalUnclaimedAmount: 15n,
    }),
    '15',
  )
  assert.equal(fingerprintLucky({ claimable: false, totalUnclaimedAmount: 5n }), '')
  assert.equal(fingerprintLucky({ claimable: true, totalUnclaimedAmount: 0n }), '')
})

test('fingerprintPositiveDecimal skips zero and non-finite', async () => {
  const { fingerprintPositiveDecimal } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(fingerprintPositiveDecimal(null), '')
  assert.equal(fingerprintPositiveDecimal(0), '')
  assert.equal(fingerprintPositiveDecimal(1.5), '1.5')
  assert.equal(fingerprintPositiveDecimal('2.00'), '2.00')
})

test('fingerprintAssetsStakeExpiry: locked clock and liquid warmup only', async () => {
  const { fingerprintAssetsStakeExpiry } = await loadModule('/src/core/claimable-unread.ts')
  const nowSec = 1_000

  assert.equal(
    fingerprintAssetsStakeExpiry([{ id: 'locked-180d-0', kind: 'locked', expiry: 1_001n }], nowSec),
    '',
  )
  assert.equal(
    fingerprintAssetsStakeExpiry([{ id: 'locked-180d-0', kind: 'locked', expiry: 1_000n }], nowSec),
    'locked-180d-0:1000',
  )
  assert.equal(
    fingerprintAssetsStakeExpiry([{ id: 'liquid', kind: 'liquid', expiry: 9n }], nowSec),
    '',
  )
  assert.equal(
    fingerprintAssetsStakeExpiry(
      [
        {
          id: 'liquid-warmup',
          kind: 'liquid',
          expiry: 12n,
          inWarmup: true,
          warmupExpired: false,
        },
      ],
      nowSec,
    ),
    '',
  )
  assert.equal(
    fingerprintAssetsStakeExpiry(
      [
        {
          id: 'liquid-warmup',
          kind: 'liquid',
          expiry: 12n,
          inWarmup: true,
          warmupExpired: true,
        },
      ],
      nowSec,
    ),
    'liquid-warmup:12',
  )
  assert.equal(
    fingerprintAssetsStakeExpiry([{ id: 'early', kind: 'early', expiry: 1_000n }], nowSec),
    'early:1000',
  )
})

test('fingerprintAssetsBondExpiry ignores drip before vesting end', async () => {
  const { fingerprintAssetsBondExpiry } = await loadModule('/src/core/claimable-unread.ts')
  const nowSec = 5_000

  assert.equal(
    fingerprintAssetsBondExpiry([{ id: 'lp-180d-0', vestingEndTime: 5_001n }], nowSec),
    '',
  )
  assert.equal(
    fingerprintAssetsBondExpiry([{ id: 'lp-180d-0', vestingEndTime: 5_000n }], nowSec),
    'lp-180d-0:5000',
  )
  assert.equal(fingerprintAssetsBondExpiry([{ id: 'burn-360d-1', vestingEndTime: 0n }], nowSec), '')
})

test('fingerprintAssetsXmineExpiry is warmup end identity, not active unstake', async () => {
  const { fingerprintAssetsXmineExpiry } = await loadModule('/src/core/claimable-unread.ts')
  const nowSec = 8_000

  assert.equal(fingerprintAssetsXmineExpiry(null, nowSec), '')
  assert.equal(fingerprintAssetsXmineExpiry({ warmupGons: 0n, warmupEndTime: 7_000n }, nowSec), '')
  assert.equal(fingerprintAssetsXmineExpiry({ warmupGons: 1n, warmupEndTime: 8_001n }, nowSec), '')
  assert.equal(
    fingerprintAssetsXmineExpiry({ warmupGons: 1n, warmupEndTime: 8_000n }, nowSec),
    'warmup:8000',
  )
})
