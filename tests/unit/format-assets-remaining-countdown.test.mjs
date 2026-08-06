import assert from 'node:assert/strict'
import test from 'node:test'

import { formatAssetsRemainingCountdown } from '../../src/core/assets/format-assets-remaining-countdown.ts'

test('formatAssetsRemainingCountdown: days + hms', () => {
  const now = 1_700_000_000
  const expiry = BigInt(now + 167 * 86_400 + 8 * 3600 + 27 * 60 + 15)
  assert.equal(formatAssetsRemainingCountdown(expiry, now, '天'), '167 天 08:27:15')
})

test('formatAssetsRemainingCountdown: under one day is hms only', () => {
  const now = 1_700_000_000
  const expiry = BigInt(now + 23 * 3600 + 59 * 60 + 59)
  assert.equal(formatAssetsRemainingCountdown(expiry, now, '天'), '23:59:59')
})

test('formatAssetsRemainingCountdown: past expiry is zero clock', () => {
  assert.equal(formatAssetsRemainingCountdown(100n, 200, '天'), '00:00:00')
})
