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
