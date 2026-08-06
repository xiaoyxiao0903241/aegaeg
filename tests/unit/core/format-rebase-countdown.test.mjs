import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatRebaseCountdownParts,
  remainingSecFromBlocks,
} from '../../../src/core/staking/format-rebase-countdown.ts'

test('remainingSecFromBlocks zeros when missing or past', () => {
  assert.equal(remainingSecFromBlocks(undefined, 10n), 0)
  assert.equal(remainingSecFromBlocks(10n, 10n), 0)
  assert.equal(remainingSecFromBlocks(5n, 10n), 0)
})

test('remainingSecFromBlocks uses 3s/block (manual FAQ)', () => {
  assert.equal(remainingSecFromBlocks(1200n, 0n), 3600)
  assert.equal(remainingSecFromBlocks(101n, 100n), 3)
})

test('formatRebaseCountdownParts pads HH/MM/SS for DigitReel', () => {
  assert.deepEqual(formatRebaseCountdownParts(3661), {
    hours: '01',
    minutes: '01',
    seconds: '01',
  })
  assert.deepEqual(formatRebaseCountdownParts(0), {
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  assert.deepEqual(formatRebaseCountdownParts(3600), {
    hours: '01',
    minutes: '00',
    seconds: '00',
  })
})
