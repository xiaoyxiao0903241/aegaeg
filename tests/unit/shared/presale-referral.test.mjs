import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('estimateAgxFromUsd1 matches deployment example', async () => {
  const { estimateAgxFromUsd1 } = await loadModule('/src/core/presale/presale-math.ts')

  const estimated = estimateAgxFromUsd1(1000, 3000, 55)
  assert.ok(Math.abs(estimated - 25.974) < 0.01)
})

test('findActivePresalePhase picks phase by timestamp', async () => {
  const { findActivePresalePhase } = await loadModule('/src/core/presale/presale-math.ts')

  const active = findActivePresalePhase(
    [
      {
        index: 0,
        minAmount: 100n,
        maxAmount: 1000n,
        discountBps: 3000n,
        airdropValueRatio: 500n,
        startTime: 100n,
        endTime: 200n,
        soldAmount: 0n,
        userPurchaseLimit: 10_000n,
      },
      {
        index: 1,
        minAmount: 100n,
        maxAmount: 1000n,
        discountBps: 2500n,
        airdropValueRatio: 200n,
        startTime: 201n,
        endTime: 300n,
        soldAmount: 0n,
        userPurchaseLimit: 20_000n,
      },
    ],
    150,
  )

  assert.equal(active?.index, 0)
})

test('parseReferrerFromSearch reads ref query param', async () => {
  const { parseReferrerFromSearch } = await loadModule('/src/shared/config/referral.ts')

  assert.equal(
    parseReferrerFromSearch('?ref=0x74A4127e0aaC45C8C23935707fE37889821029c3'),
    '0x74A4127e0aaC45C8C23935707fE37889821029c3',
  )
  assert.equal(parseReferrerFromSearch('?foo=bar'), null)
})

test('displayReferrer prefers chain referrer over API invite_address when bound', async () => {
  const { displayReferrer } = await loadModule('/src/shared/config/referral.ts')

  const apiAddress = '0x1111111111111111111111111111111111111111'
  const chainAddress = '0x2222222222222222222222222222222222222222'

  assert.equal(
    displayReferrer({
      isBound: true,
      inviteAddress: apiAddress,
      chainReferrer: chainAddress,
    }),
    chainAddress,
  )
})

test('displayReferrer falls back to API invite_address when chain referrer is missing', async () => {
  const { displayReferrer } = await loadModule('/src/shared/config/referral.ts')

  const apiAddress = '0x1111111111111111111111111111111111111111'

  assert.equal(
    displayReferrer({
      isBound: true,
      inviteAddress: apiAddress,
      chainReferrer: null,
    }),
    apiAddress,
  )
  assert.equal(
    displayReferrer({
      isBound: true,
      inviteAddress: apiAddress,
      chainReferrer: '',
    }),
    apiAddress,
  )
})
test('displayReferrer returns null when user is not bound', async () => {
  const { displayReferrer } = await loadModule('/src/shared/config/referral.ts')

  assert.equal(
    displayReferrer({
      isBound: false,
      inviteAddress: '0x1111111111111111111111111111111111111111',
      chainReferrer: '0x2222222222222222222222222222222222222222',
    }),
    null,
  )
})
