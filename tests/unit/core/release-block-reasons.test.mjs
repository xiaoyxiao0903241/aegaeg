import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('queue claim gate fails closed on zero claimable', async () => {
  const { releaseClaimBlockReason } = await loadModule('/src/core/release/release-block-reasons.ts')
  assert.equal(releaseClaimBlockReason({ claimable: 0n }), 'zeroAmount')
  assert.equal(releaseClaimBlockReason({ claimable: 1n }), null)
})

test('release progress bps is claimable / (claimable + releasing)', async () => {
  const { releaseProgressBps } = await loadModule('/src/core/release/release-block-reasons.ts')
  assert.equal(releaseProgressBps(0n, 0n), 0)
  assert.equal(releaseProgressBps(26n, 92n), 2203)
  assert.equal(releaseProgressBps(100n, 0n), 10_000)
})

test('submit-release must not revive mixed claimWindows', async () => {
  const { readFile } = await import('node:fs/promises')
  const submit = await readFile(
    new URL('../../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(submit, /WRITE_PATH\.RELEASE_CLAIM/)
  assert.doesNotMatch(submit, /hop\.claimWindows/)
  assert.doesNotMatch(submit, /evaluateReleaseBufferClaimGate/)
  assert.doesNotMatch(submit, /claimManyPaged/)
})
