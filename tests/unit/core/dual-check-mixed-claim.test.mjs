import assert from 'node:assert/strict'
import test from 'node:test'

test('money-path submit must not trust draft amount as live rewardAvailable', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  // Fail-closed: never pass the UI draft amount into evaluate as if it were chain state.
  assert.doesNotMatch(submitSrc, /rewardAvailable:\s*amount/)
})
