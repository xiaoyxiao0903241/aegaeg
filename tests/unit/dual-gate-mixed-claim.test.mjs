import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const okSnap = {
  rewardAvailable: 100n,
  contribution: 1_000n,
  requiredContribution: 10n,
  releasePlanIndex: 0,
  restakePlanIndex: 1,
}

test('dualGateMixedClaim fails on intent phase without requiring live fields', async () => {
  const { dualGateMixedClaim } = await loadModule('/src/core/assets/dual-gate-mixed-claim.ts')
  const result = dualGateMixedClaim({
    amount: 100n,
    intent: { ...okSnap, contribution: 1n },
    live: okSnap,
  })
  assert.deepEqual(result, {
    ok: false,
    fail: { phase: 'intent', reason: 'insufficientContribution' },
  })
})

test('dualGateMixedClaim fails on live phase when reward drops', async () => {
  const { dualGateMixedClaim } = await loadModule('/src/core/assets/dual-gate-mixed-claim.ts')
  const result = dualGateMixedClaim({
    amount: 100n,
    intent: okSnap,
    live: { ...okSnap, rewardAvailable: 50n },
  })
  assert.deepEqual(result, {
    ok: false,
    fail: { phase: 'live', reason: 'insufficientReward' },
  })
})

test('dualGateMixedClaim returns narrowed ready when both snapshots pass', async () => {
  const { dualGateMixedClaim } = await loadModule('/src/core/assets/dual-gate-mixed-claim.ts')
  const intent = { ...okSnap }
  const live = { ...okSnap, releasePlanIndex: 2, restakePlanIndex: 3 }
  const result = dualGateMixedClaim({ amount: 100n, intent, live })
  assert.deepEqual(result, {
    ok: true,
    ready: { amount: 100n, releasePlanIndex: 2, restakePlanIndex: 3 },
  })
})

test('submitMixedClaim source uses dualGate + unknown envelope (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../src/views/dapp/assets/submit-assets.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /dualGateMixedClaim/)
  assert.match(src, /runUnknownGuardedWrite/)
  assert.match(src, /readMixedRewardAvailable/)
  assert.doesNotMatch(src, /rewardAvailable:\s*amount/)
})

test('submitRelease source uses unknown envelope (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /runUnknownGuardedWrite/)
  assert.doesNotMatch(src, /lockUnknownReceipt\(/)
})
