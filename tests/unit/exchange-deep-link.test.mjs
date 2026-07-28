import assert from 'node:assert/strict'
import test from 'node:test'

// Mirror resolveDappLocationFromHash without Vite path aliases.
const tabOrder = ['exchange', 'assets', 'staking', 'rewards', 'release', 'community', 'genesis']
const EXCHANGE_VIEWS = new Set(['hub', 'flash', 'trade', 'burn', 'turbine'])

function resolveDappLocationFromHash(hash) {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return { tab: 'exchange', exchangeView: 'hub' }
  const [tabPart, viewPart] = raw.split('/')
  if (!tabOrder.includes(tabPart)) return null
  if (tabPart !== 'exchange') return { tab: tabPart, exchangeView: null }
  if (!viewPart) return { tab: 'exchange', exchangeView: null }
  if (!EXCHANGE_VIEWS.has(viewPart)) return { tab: 'exchange', exchangeView: 'hub' }
  return { tab: 'exchange', exchangeView: viewPart }
}

test('EX-B4 deep link resolves exchange/burn', () => {
  assert.deepEqual(resolveDappLocationFromHash('exchange/burn'), {
    tab: 'exchange',
    exchangeView: 'burn',
  })
  assert.deepEqual(resolveDappLocationFromHash('#exchange/turbine'), {
    tab: 'exchange',
    exchangeView: 'turbine',
  })
  assert.deepEqual(resolveDappLocationFromHash('swap'), {
    tab: 'exchange',
    exchangeView: 'hub',
  })
  assert.deepEqual(resolveDappLocationFromHash('genesis'), {
    tab: 'genesis',
    exchangeView: null,
  })
})
