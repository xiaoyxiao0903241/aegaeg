import assert from 'node:assert/strict'
import test from 'node:test'

import { formatRebaseCountdown } from '../../src/core/staking/format-rebase-countdown.ts'

test('formatRebaseCountdown zeros when missing or past', () => {
  assert.equal(formatRebaseCountdown(undefined, 10n), '00 小时 00 分钟 00 秒')
  assert.equal(formatRebaseCountdown(10n, 10n), '00 小时 00 分钟 00 秒')
  assert.equal(formatRebaseCountdown(5n, 10n), '00 小时 00 分钟 00 秒')
})

test('formatRebaseCountdown uses 3s/block (manual FAQ)', () => {
  // 1200 blocks × 3s = 3600s = 01 小时
  assert.equal(formatRebaseCountdown(1200n, 0n), '01 小时 00 分钟 00 秒')
  // 1 block → 3s
  assert.equal(formatRebaseCountdown(101n, 100n), '00 小时 00 分钟 03 秒')
})
