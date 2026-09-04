import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('formatAssetsPositionAmount: missing or invalid price → --; zero price → $0.00', async () => {
  const { formatAssetsPositionAmount } = await loadModule(
    '/src/views/dapp/assets/position/format-assets-position-amount.ts',
  )
  const one = 10n ** 18n

  assert.equal(formatAssetsPositionAmount(one, 18, 'usd', null, 'AGX'), '--')
  assert.equal(formatAssetsPositionAmount(one, 18, 'usd', Number.NaN, 'AGX'), '--')
  assert.equal(formatAssetsPositionAmount(one, 18, 'usd', -1, 'AGX'), '--')
  assert.equal(formatAssetsPositionAmount(one, 18, 'usd', 0, 'AGX'), '$0.00')
  assert.equal(formatAssetsPositionAmount(one, 18, 'usd', 2, 'AGX'), '$2.00')
})
