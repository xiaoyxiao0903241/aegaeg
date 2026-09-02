import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('pickFirstClaimPage: first 50 with claimable, skips empty leading pages', async () => {
  const { pickFirstClaimPage, RELEASE_CLAIM_PAGE } = await loadModule(
    '/src/core/release/pick-release-claim-page.ts',
  )
  assert.equal(RELEASE_CLAIM_PAGE, 50)

  assert.deepEqual(
    pickFirstClaimPage({
      size: 200,
      pageClaimable: (start) => (start === 0 ? 10n : 0n),
    }),
    { start: 0, limit: 50, claimable: 10n },
  )

  assert.deepEqual(
    pickFirstClaimPage({
      size: 200,
      pageClaimable: (start) => (start === 50 ? 7n : 0n),
    }),
    { start: 50, limit: 50, claimable: 7n },
  )
})

test('pickFirstClaimPage: tail page uses remaining size; empty ledger is null', async () => {
  const { pickFirstClaimPage } = await loadModule('/src/core/release/pick-release-claim-page.ts')

  assert.deepEqual(
    pickFirstClaimPage({
      size: 10,
      pageClaimable: () => 3n,
    }),
    { start: 0, limit: 10, claimable: 3n },
  )
  assert.equal(
    pickFirstClaimPage({
      size: 200,
      pageClaimable: () => 0n,
    }),
    null,
  )
  assert.equal(pickFirstClaimPage({ size: 0, pageClaimable: () => 1n }), null)
})

test('pickBufferFirstClaim: first hop with a window', async () => {
  const { pickBufferFirstClaim } = await loadModule('/src/core/release/pick-release-claim-page.ts')
  const hop0 = '0x1111111111111111111111111111111111111111'
  const hop1 = '0x2222222222222222222222222222222222222222'

  assert.deepEqual(
    pickBufferFirstClaim({
      chain: [
        { address: hop0, claimWindows: [] },
        {
          address: hop1,
          claimWindows: [
            { start: 50, limit: 50 },
            { start: 100, limit: 50 },
          ],
        },
      ],
    }),
    { splitter: hop1, start: 50, limit: 50 },
  )

  assert.equal(
    pickBufferFirstClaim({
      chain: [{ address: hop0, claimWindows: [] }],
    }),
    null,
  )
})
