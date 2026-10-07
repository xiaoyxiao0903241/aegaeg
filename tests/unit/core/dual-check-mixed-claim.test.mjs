import assert from 'node:assert/strict'
import test from 'node:test'

test('mixed claim writes the confirmed amount and still checks live available', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  assert.match(submitSrc, /rewardAvailable:\s*snap\.rewardAvailable/)
  assert.match(submitSrc, /evaluateMixedClaim\(\{\s*amount,/)
  assert.doesNotMatch(submitSrc, /rewardAvailable:\s*amount\b/)
  assert.doesNotMatch(submitSrc, /const amount = live\.rewardAvailable/)
})
