import assert from 'node:assert/strict'
import test from 'node:test'

import {
  cobuildLevelFromRank,
  cobuildNextReqSpecs,
  cobuildNextTier,
  cobuildReqGridCols,
} from '../../../src/core/rewards/cobuild-tier-ladder.ts'

test('cobuildLevelFromRank maps 1–13 to A#, ≥14 to lifetime, else NONE', () => {
  assert.equal(cobuildLevelFromRank(null), 'NONE')
  assert.equal(cobuildLevelFromRank(0), 'NONE')
  assert.equal(cobuildLevelFromRank(1), 'A1')
  assert.equal(cobuildLevelFromRank(4), 'A4')
  assert.equal(cobuildLevelFromRank(13), 'A13')
  assert.equal(cobuildLevelFromRank(14), 'LIFETIME')
  assert.equal(cobuildLevelFromRank(20), 'LIFETIME')
})

test('no level → A1 volume conditions; 3 cards', () => {
  assert.equal(cobuildNextTier('NONE')?.id, 'A1')
  const specs = cobuildNextReqSpecs('NONE')
  assert.deepEqual(
    specs.map((spec) => spec.kind),
    ['holding', 'accounts', 'volume'],
  )
  assert.equal(cobuildReqGridCols(specs.length), 3)
})

test('A4 → A5 still uses total volume', () => {
  assert.equal(cobuildNextTier('A4')?.id, 'A5')
  assert.deepEqual(
    cobuildNextReqSpecs('A4').map((spec) => spec.kind),
    ['holding', 'accounts', 'volume'],
  )
})

test('A5 → A6 opens dual lines plus other-line volume (4 cards)', () => {
  const specs = cobuildNextReqSpecs('A5')
  assert.deepEqual(
    specs.map((spec) => spec.kind),
    ['holding', 'accounts', 'dual', 'otherLine'],
  )
  const dual = specs.find((spec) => spec.kind === 'dual')
  const other = specs.find((spec) => spec.kind === 'otherLine')
  assert.equal(dual && dual.kind === 'dual' ? dual.lineLevel : null, 'A5')
  assert.equal(other && other.kind === 'otherLine' ? other.targetUsd : null, 1_000_000)
  assert.equal(cobuildReqGridCols(specs.length), 2)
})

test('A9 → A10 drops other-line path', () => {
  const specs = cobuildNextReqSpecs('A9')
  assert.deepEqual(
    specs.map((spec) => spec.kind),
    ['holding', 'accounts', 'dual'],
  )
  assert.equal(cobuildReqGridCols(specs.length), 3)
})

test('lifetime has no next tier', () => {
  assert.equal(cobuildNextTier('LIFETIME'), null)
  assert.deepEqual(cobuildNextReqSpecs('LIFETIME'), [])
})
