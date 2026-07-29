import assert from 'node:assert/strict'
import test from 'node:test'
import {
  evaluateReleaseBufferClaimGate,
  evaluateReleaseQueueClaimGate,
  releaseProgressBps,
} from '../../src/core/release/release-gates.ts'

test('queue claim gate fails closed on zero and unknown lock', () => {
  assert.equal(evaluateReleaseQueueClaimGate({ claimable: 0n, unknownLocked: false }), 'zeroAmount')
  assert.equal(
    evaluateReleaseQueueClaimGate({ claimable: 1n, unknownLocked: true }),
    'lockedUnknown',
  )
  assert.equal(evaluateReleaseQueueClaimGate({ claimable: 1n, unknownLocked: false }), null)
})

test('buffer claim gate mirrors queue claimable rules', () => {
  assert.equal(
    evaluateReleaseBufferClaimGate({ claimable: 0n, unknownLocked: false }),
    'zeroAmount',
  )
  assert.equal(evaluateReleaseBufferClaimGate({ claimable: 10n, unknownLocked: false }), null)
})

test('release progress bps is claimable / (claimable + releasing)', () => {
  assert.equal(releaseProgressBps(0n, 0n), 0)
  assert.equal(releaseProgressBps(26n, 92n), 2203)
  assert.equal(releaseProgressBps(100n, 0n), 10_000)
})

test('submit release live-gates and EX-U5 invalidate turbine', async () => {
  const { readFile } = await import('node:fs/promises')
  const submit = await readFile(
    new URL('../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  const invalidate = await readFile(
    new URL('../../src/shared/api/query/invalidate.ts', import.meta.url),
    'utf8',
  )
  assert.match(submit, /readReleaseQueueSnapshot/)
  assert.match(submit, /readReleaseBufferSnapshot/)
  assert.match(submit, /WRITE_PATH\.RELEASE_CLAIM/)
  assert.match(submit, /invalidateAfterReleaseClaim/)
  assert.match(submit, /const live = await readReleaseQueueSnapshot/)
  assert.match(submit, /const live = await readReleaseBufferSnapshot/)
  assert.match(invalidate, /invalidateAfterReleaseClaim/)
  assert.match(invalidate, /release:\s*\[[\s\S]*turbineRoot/)
})
