import assert from 'node:assert/strict'
import test from 'node:test'
import {
  releaseClaimBlockReason,
  releaseProgressBps,
} from '../../src/core/release/release-gates.ts'

test('queue claim gate fails closed on zero and unknown lock', () => {
  assert.equal(releaseClaimBlockReason({ claimable: 0n, unknownLocked: false }), 'zeroAmount')
  assert.equal(releaseClaimBlockReason({ claimable: 1n, unknownLocked: true }), 'lockedUnknown')
  assert.equal(releaseClaimBlockReason({ claimable: 1n, unknownLocked: false }), null)
})

test('release progress bps is claimable / (claimable + releasing)', () => {
  assert.equal(releaseProgressBps(0n, 0n), 0)
  assert.equal(releaseProgressBps(26n, 92n), 2203)
  assert.equal(releaseProgressBps(100n, 0n), 10_000)
})

test('submit release live-gates; envelope path on views + hook (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const submit = await readFile(
    new URL('../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  const queueView = await readFile(
    new URL('../../src/views/dapp/release/queue/use-release-queue-view.ts', import.meta.url),
    'utf8',
  )
  const bufferView = await readFile(
    new URL('../../src/views/dapp/release/buffer/use-release-buffer-view.ts', import.meta.url),
    'utf8',
  )
  const hook = await readFile(
    new URL('../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  const invalidate = await readFile(
    new URL('../../src/shared/api/query/invalidate.ts', import.meta.url),
    'utf8',
  )
  const tabKeys = await readFile(
    new URL('../../src/shared/api/query/tab-query-keys.ts', import.meta.url),
    'utf8',
  )
  assert.match(submit, /readReleaseQueueSnapshot/)
  assert.match(submit, /readReleaseBufferSnapshot/)
  assert.doesNotMatch(submit, /submitWithUnknownReceiptLock/)
  assert.doesNotMatch(submit, /WRITE_PATH\.RELEASE_CLAIM/)
  assert.match(queueView, /WRITE_PATH\.RELEASE_CLAIM/)
  assert.match(bufferView, /WRITE_PATH\.RELEASE_CLAIM/)
  assert.match(hook, /submitWithUnknownReceiptLock/)
  assert.match(submit, /invalidateAfterReleaseClaim/)
  assert.match(submit, /const live = await readReleaseQueueSnapshot/)
  assert.match(submit, /const live = await readReleaseBufferSnapshot/)
  assert.match(submit, /releaseClaimBlockReason/)
  assert.doesNotMatch(submit, /evaluateReleaseBufferClaimGate/)
  assert.match(invalidate, /invalidateAfterReleaseClaim/)
  assert.match(tabKeys, /release:\s*\[[\s\S]*turbineRoot/)
})
