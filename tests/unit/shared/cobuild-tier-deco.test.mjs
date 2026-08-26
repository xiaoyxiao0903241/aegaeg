import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('cobuildTierDecoSrc maps A1–A13 and falls back off-range', async () => {
  const { cobuildTierDecoSrc, cobuildTierDecos, dappAssets } = await loadModule(
    '/src/shared/assets/dapp.ts',
  )
  assert.equal(cobuildTierDecos.length, 13)
  assert.equal(cobuildTierDecoSrc(1, 'fb'), cobuildTierDecos[0])
  assert.equal(cobuildTierDecoSrc(13, 'fb'), cobuildTierDecos[12])
  assert.equal(cobuildTierDecoSrc(14, 'fb'), cobuildTierDecos[12])
  assert.equal(cobuildTierDecoSrc(0, 'fb'), 'fb')
  assert.equal(
    cobuildTierDecoSrc(null, dappAssets.rewardsHubTierDeco),
    dappAssets.rewardsHubTierDeco,
  )
  assert.equal(cobuildTierDecoSrc(undefined, 'fb'), 'fb')
})
