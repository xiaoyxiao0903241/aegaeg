import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('resolveDappTabSelect switches when the tapped tab is not current', async () => {
  const { resolveDappTabSelect } = await loadModule('/src/shared/config/dapp-tabs.ts')

  assert.equal(
    resolveDappTabSelect({ tab: 'staking', activeTab: 'assets', subview: 'stake' }),
    'switch-tab',
  )
})

test('resolveDappTabSelect returns to hub when reselecting the current subview tab', async () => {
  const { resolveDappTabSelect } = await loadModule('/src/shared/config/dapp-tabs.ts')

  assert.equal(
    resolveDappTabSelect({ tab: 'assets', activeTab: 'assets', subview: 'stake' }),
    'back-to-hub',
  )
})

test('resolveDappTabSelect is a no-op on the current hub or a tab without subviews', async () => {
  const { resolveDappTabSelect } = await loadModule('/src/shared/config/dapp-tabs.ts')

  assert.equal(resolveDappTabSelect({ tab: 'assets', activeTab: 'assets', subview: 'hub' }), 'noop')
  assert.equal(resolveDappTabSelect({ tab: 'community', activeTab: 'community' }), 'noop')
})
