import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatRebaseCountdown,
  formatRebaseCountdownParts,
  remainingSecFromBlocks,
} from '../../src/core/staking/format-rebase-countdown.ts'

test('formatRebaseCountdown zeros when missing or past', () => {
  assert.equal(formatRebaseCountdown(undefined, 10n), '00 小时 00 分钟 00 秒')
  assert.equal(formatRebaseCountdown(10n, 10n), '00 小时 00 分钟 00 秒')
  assert.equal(formatRebaseCountdown(5n, 10n), '00 小时 00 分钟 00 秒')
})

test('formatRebaseCountdown uses 3s/block (manual FAQ)', () => {
  assert.equal(formatRebaseCountdown(1200n, 0n), '01 小时 00 分钟 00 秒')
  assert.equal(formatRebaseCountdown(101n, 100n), '00 小时 00 分钟 03 秒')
})

test('remainingSecFromBlocks + formatRebaseCountdownParts feed live clock', () => {
  assert.equal(remainingSecFromBlocks(101n, 100n), 3)
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
})
