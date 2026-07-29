import assert from 'node:assert/strict'
import test from 'node:test'

const tabOrder = ['exchange', 'assets', 'staking', 'rewards', 'release', 'community', 'genesis']
const EXCHANGE_VIEWS = new Set(['hub', 'flash', 'trade', 'burn', 'turbine'])
const STAKING_VIEWS = new Set(['hub', 'stake', 'lpbond', 'burnbond', 'xmine', 'calc'])

function resolveDappLocationFromHash(hash) {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return { tab: 'exchange', exchangeView: 'hub', stakingView: null }
  const [tabPart, viewPart] = raw.split('/')
  if (!tabOrder.includes(tabPart)) return null
  if (tabPart === 'exchange') {
    if (!viewPart) return { tab: 'exchange', exchangeView: null, stakingView: null }
    if (!EXCHANGE_VIEWS.has(viewPart))
      return { tab: 'exchange', exchangeView: 'hub', stakingView: null }
    return { tab: 'exchange', exchangeView: viewPart, stakingView: null }
  }
  if (tabPart === 'staking') {
    if (!viewPart) return { tab: 'staking', exchangeView: null, stakingView: null }
    if (!STAKING_VIEWS.has(viewPart))
      return { tab: 'staking', exchangeView: null, stakingView: 'hub' }
    return { tab: 'staking', exchangeView: null, stakingView: viewPart }
  }
  return { tab: tabPart, exchangeView: null, stakingView: null }
}

test('EX-B4 deep link resolves exchange/burn', () => {
  assert.deepEqual(resolveDappLocationFromHash('exchange/burn'), {
    tab: 'exchange',
    exchangeView: 'burn',
    stakingView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('#exchange/turbine'), {
    tab: 'exchange',
    exchangeView: 'turbine',
    stakingView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('swap'), {
    tab: 'exchange',
    exchangeView: 'hub',
    stakingView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('genesis'), {
    tab: 'genesis',
    exchangeView: null,
    stakingView: null,
  })
})

test('staking deep link resolves hub and subviews', () => {
  assert.deepEqual(resolveDappLocationFromHash('staking'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('#staking/stake'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: 'stake',
  })
  assert.deepEqual(resolveDappLocationFromHash('staking/lpbond'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: 'lpbond',
  })
  assert.deepEqual(resolveDappLocationFromHash('staking/nope'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: 'hub',
  })
})
