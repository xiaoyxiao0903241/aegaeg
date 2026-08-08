import assert from 'node:assert/strict'
import test from 'node:test'

test('submitMixedClaim source uses approveThenLiveWrite + evaluateMixedClaim; envelope lives in useChainMutation (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  const hookSrc = await readFile(
    new URL('../../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  assert.match(submitSrc, /approveThenLiveWrite/)
  assert.match(submitSrc, /evaluateMixedClaim/)
  assert.match(submitSrc, /readMixedRewardAvailable/)
  assert.doesNotMatch(submitSrc, /submitWithUnknownReceiptLock/)
  assert.doesNotMatch(submitSrc, /rewardAvailable:\s*amount/)
  assert.match(hookSrc, /submitWithUnknownReceiptLock/)
})

test('submitRelease source has no envelope; hook owns unknown latch (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  const hookSrc = await readFile(
    new URL('../../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(submitSrc, /submitWithUnknownReceiptLock/)
  assert.doesNotMatch(submitSrc, /lockUnknownReceipt\(/)
  assert.match(hookSrc, /submitWithUnknownReceiptLock/)
})

test('evaluateMixedClaim dual-phase: intent fail then live fail (same rules as former dualCheck)', async () => {
  const { loadModule } = await import('../load-module.mjs')
  const { evaluateMixedClaim } = await loadModule('/src/core/assets/assets-block-reasons.ts')
  const okSnap = {
    rewardAvailable: 100n,
    contribution: 1_000n,
    requiredContribution: 10n,
    releasePlanIndex: 0,
    restakePlanIndex: 1,
  }
  assert.equal(
    evaluateMixedClaim({ amount: 100n, ...okSnap, contribution: 1n }),
    'insufficientContribution',
  )
  assert.equal(
    evaluateMixedClaim({ amount: 100n, ...okSnap, rewardAvailable: 50n }),
    'insufficientReward',
  )
  assert.equal(evaluateMixedClaim({ amount: 100n, ...okSnap }), null)
})
