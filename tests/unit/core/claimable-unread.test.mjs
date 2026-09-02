import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isClaimableDotLit: balance stays lit until empty; event uses set difference', async () => {
  const { isClaimableDotLit } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(isClaimableDotLit('balance', '', null), false)
  assert.equal(isClaimableDotLit('balance', 'pending', 'pending'), true)
  assert.equal(isClaimableDotLit('balance', 'pending', null), true)

  assert.equal(isClaimableDotLit('event', '', null), false)
  assert.equal(isClaimableDotLit('event', 'A', null), true)
  assert.equal(isClaimableDotLit('event', 'A', 'A'), false)
  assert.equal(isClaimableDotLit('event', 'B', 'A'), true)
  assert.equal(isClaimableDotLit('event', 'B', 'A|B'), false)
  assert.equal(isClaimableDotLit('event', 'A|C', 'A|B'), true)
})

test('mergeAckFingerprint unions ids and does not replace', async () => {
  const { mergeAckFingerprint } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(mergeAckFingerprint(null, 'A'), 'A')
  assert.equal(mergeAckFingerprint('A|B', 'B'), 'A|B')
  assert.equal(mergeAckFingerprint('A|B', 'C'), 'A|B|C')
  assert.equal(mergeAckFingerprint('A|B', ''), 'A|B')
})

test('fingerprintIdList sorts unique ids; empty list is empty', async () => {
  const { fingerprintIdList } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(fingerprintIdList([]), '')
  assert.equal(fingerprintIdList(['3', '1', '1']), '1|3')
})

test('fingerprintReleaseQueue lights only completed unclaimed plans', async () => {
  const { fingerprintReleaseQueue } = await loadModule('/src/core/claimable-unread.ts')

  const plans = [
    { planIndex: 0, total: 100n, overallClaimable: 40n, releasing: 60n },
    { planIndex: 1, total: 50n, overallClaimable: 50n, releasing: 0n },
  ]
  assert.equal(fingerprintReleaseQueue(plans), '1:50')
  assert.equal(
    fingerprintReleaseQueue([{ planIndex: 1, total: 50n, overallClaimable: 10n, releasing: 0n }]),
    '1:50',
  )
  assert.equal(
    fingerprintReleaseQueue([{ planIndex: 1, total: 50n, overallClaimable: 0n, releasing: 0n }]),
    '',
  )
})

test('fingerprintReleaseBuffer lights completed buckets only', async () => {
  const { fingerprintReleaseBuffer } = await loadModule('/src/core/claimable-unread.ts')

  assert.equal(
    fingerprintReleaseBuffer({
      agxClaimable: 1n,
      gagxClaimable: 0n,
      agxReleasing: 9n,
      gagxReleasing: 0n,
    }),
    '',
  )
  assert.equal(
    fingerprintReleaseBuffer({
      agxClaimable: 1n,
      gagxClaimable: 0n,
      agxReleasing: 0n,
      gagxReleasing: 20n,
    }),
    'agx',
  )
  assert.equal(
    fingerprintReleaseBuffer({
      agxClaimable: 1n,
      gagxClaimable: 2n,
      agxReleasing: 0n,
      gagxReleasing: 0n,
    }),
    'agx|gagx',
  )
})

test('fingerprintLucky is pending placeholder, not amount', async () => {
  const { CLAIMABLE_BALANCE_ID, fingerprintLucky } = await loadModule(
    '/src/core/claimable-unread.ts',
  )

  assert.equal(
    fingerprintLucky({
      claimable: true,
      totalUnclaimedAmount: 15n,
    }),
    CLAIMABLE_BALANCE_ID,
  )
  assert.equal(
    fingerprintLucky({
      claimable: true,
      totalUnclaimedAmount: 99n,
    }),
    CLAIMABLE_BALANCE_ID,
  )
  assert.equal(fingerprintLucky({ claimable: false, totalUnclaimedAmount: 5n }), '')
  assert.equal(fingerprintLucky({ claimable: true, totalUnclaimedAmount: 0n }), '')
})

test('fingerprintPositiveDecimal is pending placeholder for any positive amount', async () => {
  const { CLAIMABLE_BALANCE_ID, fingerprintPositiveDecimal } = await loadModule(
    '/src/core/claimable-unread.ts',
  )

  assert.equal(fingerprintPositiveDecimal(null), '')
  assert.equal(fingerprintPositiveDecimal(0), '')
  assert.equal(fingerprintPositiveDecimal(1.5), CLAIMABLE_BALANCE_ID)
  assert.equal(fingerprintPositiveDecimal('2.00'), CLAIMABLE_BALANCE_ID)
})

test('fingerprintAssetsStakeExpiry: locked and early only; liquid never', async () => {
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
    fingerprintAssetsStakeExpiry([{ id: 'liquid-warmup', kind: 'liquid', expiry: 12n }], nowSec),
    '',
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
