import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('queue claim gate fails closed on zero and unknown lock', async () => {
  const { releaseClaimBlockReason } = await loadModule('/src/core/release/release-block-reasons.ts')
  assert.equal(releaseClaimBlockReason({ claimable: 0n, unknownLocked: false }), 'zeroAmount')
  assert.equal(releaseClaimBlockReason({ claimable: 1n, unknownLocked: true }), 'lockedUnknown')
  assert.equal(releaseClaimBlockReason({ claimable: 1n, unknownLocked: false }), null)
})

test('release progress bps is claimable / (claimable + releasing)', async () => {
  const { releaseProgressBps } = await loadModule('/src/core/release/release-block-reasons.ts')
  assert.equal(releaseProgressBps(0n, 0n), 0)
  assert.equal(releaseProgressBps(26n, 92n), 2203)
  assert.equal(releaseProgressBps(100n, 0n), 10_000)
})

test('submit release live-blocks; envelope path on views + hook (string lock)', async () => {
  const { readFile } = await import('node:fs/promises')
  const submit = await readFile(
    new URL('../../../src/views/dapp/release/submit-release.ts', import.meta.url),
    'utf8',
  )
  const queueView = await readFile(
    new URL('../../../src/views/dapp/release/queue/use-queue.ts', import.meta.url),
    'utf8',
  )
  const bufferView = await readFile(
    new URL('../../../src/views/dapp/release/buffer/use-buffer.ts', import.meta.url),
    'utf8',
  )
  const hook = await readFile(
    new URL('../../../src/hooks/use-chain-mutation.ts', import.meta.url),
    'utf8',
  )
  const invalidate = await readFile(
    new URL('../../../src/shared/api/query/invalidate.ts', import.meta.url),
    'utf8',
  )
  const tabKeys = await readFile(
    new URL('../../../src/shared/api/query/tab-query-keys.ts', import.meta.url),
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
  assert.match(submit, /agxClaimIndexes/)
  assert.match(submit, /gagxClaimIndexes/)
  assert.match(submit, /archiveClaimWindows/)
  assert.match(submit, /ReleaseBufferClaimToken/)
  // 按币隔离：token 选 index；gAGX 不碰归档；逐笔写后立刻 invalidate（部分成功也刷新）
  assert.match(submit, /token === 'agx' \? hop\.agxClaimIndexes : hop\.gagxClaimIndexes/)
  assert.match(submit, /token === 'agx' && live\.archiveClaimWindows/)
  assert.match(
    submit,
    /async function claimIndexes[\s\S]*?await args\.write\(index, 1\)\s*invalidateAfterReleaseClaim\(\)/,
  )
  assert.match(
    submit,
    /async function claimWindows[\s\S]*?await args\.write\(window\.start, window\.limit\)\s*invalidateAfterReleaseClaim\(\)/,
  )
  assert.match(bufferView, /claimAgx[\s\S]*submitReleaseBufferClaim\(\{[\s\S]*token: 'agx'/)
  assert.match(bufferView, /claimGagx[\s\S]*submitReleaseBufferClaim\(\{[\s\S]*token: 'gagx'/)
  assert.match(bufferView, /pathBusy/)
  assert.match(bufferView, /unknownReceiptLocked:\s*pathBusy/)
  // 负向：链跳不得再走混币 claimWindows 写窗
  assert.doesNotMatch(submit, /hop\.claimWindows/)
  assert.doesNotMatch(submit, /evaluateReleaseBufferClaimGate/)
  assert.doesNotMatch(submit, /claimManyPaged/)
  assert.match(invalidate, /invalidateAfterReleaseClaim/)
  assert.match(tabKeys, /release:\s*\[[\s\S]*turbineRoot/)
})
