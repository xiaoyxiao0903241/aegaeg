import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('cobuildTierDecoSrc maps A1–A13 and falls back off-range', async () => {
  const { cobuildTierDecoSrc, dappAssets } = await loadModule('/src/shared/assets/dapp.ts')
  const a1 = cobuildTierDecoSrc(1, 'fb')
  const a13 = cobuildTierDecoSrc(13, 'fb')
  assert.notEqual(a1, a13)
  assert.notEqual(a1, 'fb')
  assert.equal(cobuildTierDecoSrc(14, 'fb'), a13)
  assert.equal(cobuildTierDecoSrc(0, 'fb'), 'fb')
  assert.equal(
    cobuildTierDecoSrc(null, dappAssets.rewardsHubTierDeco),
    dappAssets.rewardsHubTierDeco,
  )
  assert.equal(cobuildTierDecoSrc(undefined, 'fb'), 'fb')
})
