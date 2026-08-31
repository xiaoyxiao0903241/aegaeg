import assert from 'node:assert/strict'
import test from 'node:test'

import { aggregateStakeRelease } from '../../../src/core/staking/aggregate-stake-release.ts'

test('liquid rows contribute 0 to released and pending; principal still counted by caller', () => {
  const rows = [
    {
      kind: 'liquid',
      principal: 100n,
      releasedPrincipal: 0n,
    },
    {
      kind: 'locked',
      principal: 200n,
      releasedPrincipal: 50n,
    },
  ]
  const out = aggregateStakeRelease(rows)
  assert.equal(out.released, 50n)
  assert.equal(out.pending, 150n)
})

test('all-liquid portfolio: released and pending are 0', () => {
  const out = aggregateStakeRelease([
    { kind: 'liquid', principal: 80n, releasedPrincipal: 0n },
    { kind: 'liquid', principal: 20n, releasedPrincipal: 0n },
  ])
  assert.equal(out.released, 0n)
  assert.equal(out.pending, 0n)
})

test('early rows count released and pending like locked', () => {
  const out = aggregateStakeRelease([
    { kind: 'early', principal: 120n, releasedPrincipal: 20n },
    { kind: 'locked', principal: 10n, releasedPrincipal: 10n },
  ])
  assert.equal(out.released, 30n)
  assert.equal(out.pending, 100n)
})

test('locked-only keeps principal − released pending', () => {
  const out = aggregateStakeRelease([
    { kind: 'locked', principal: 100n, releasedPrincipal: 40n },
    { kind: 'locked', principal: 10n, releasedPrincipal: 10n },
  ])
  assert.equal(out.released, 50n)
  assert.equal(out.pending, 60n)
})
