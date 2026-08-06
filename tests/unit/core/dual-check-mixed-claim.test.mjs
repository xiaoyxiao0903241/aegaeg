import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const okSnap = {
  rewardAvailable: 100n,
  contribution: 1_000n,
  requiredContribution: 10n,
  releasePlanIndex: 0,
  restakePlanIndex: 1,
}

test('dualCheckMixedClaim fails on intent phase without requiring live fields', async () => {
  const { dualCheckMixedClaim } = await loadModule('/src/core/assets/dual-check-mixed-claim.ts')
  const result = dualCheckMixedClaim({
    amount: 100n,
    intent: { ...okSnap, contribution: 1n },
    live: okSnap,
  })
  assert.deepEqual(result, {
    ok: false,
    fail: { phase: 'intent', reason: 'insufficientContribution' },
  })
})

test('dualCheckMixedClaim fails on live phase when reward drops', async () => {
  const { dualCheckMixedClaim } = await loadModule('/src/core/assets/dual-check-mixed-claim.ts')
  const result = dualCheckMixedClaim({
    amount: 100n,
    intent: okSnap,
    live: { ...okSnap, rewardAvailable: 50n },
  })
  assert.deepEqual(result, {
    ok: false,
    fail: { phase: 'live', reason: 'insufficientReward' },
  })
})

test('dualCheckMixedClaim returns narrowed ready when both snapshots pass', async () => {
  const { dualCheckMixedClaim } = await loadModule('/src/core/assets/dual-check-mixed-claim.ts')
  const intent = { ...okSnap }
  const live = { ...okSnap, releasePlanIndex: 2, restakePlanIndex: 3 }
  const result = dualCheckMixedClaim({ amount: 100n, intent, live })
  assert.deepEqual(result, {
    ok: true,
    ready: { amount: 100n, releasePlanIndex: 2, restakePlanIndex: 3 },
  })
})

test('submitMixedClaim source uses dualCheckMixedClaim; envelope lives in useChainMutation (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  const hookSrc = await readFile(
    new URL('../../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  assert.match(submitSrc, /dualCheckMixedClaim/)
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
