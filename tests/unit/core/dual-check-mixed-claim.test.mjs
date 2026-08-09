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

test('unknown-receipt envelope stays in useChainMutation, not domain submit', async () => {
  const { readFile } = await import('node:fs/promises')
  const assetsSubmit = await readFile(
    new URL('../../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  const releaseSubmit = await readFile(
    new URL('../../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  const hookSrc = await readFile(
    new URL('../../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(assetsSubmit, /submitWithUnknownReceiptLock/)
  assert.doesNotMatch(releaseSubmit, /submitWithUnknownReceiptLock/)
  assert.doesNotMatch(releaseSubmit, /lockUnknownReceipt\(/)
  // Positive only as placement guard: envelope must still live in the hook.
  assert.match(hookSrc, /submitWithUnknownReceiptLock/)
})
