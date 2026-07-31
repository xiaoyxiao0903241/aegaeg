import assert from 'node:assert/strict'
import test from 'node:test'

const tabOrder = ['exchange', 'assets', 'staking', 'rewards', 'release', 'community', 'genesis']
const EXCHANGE_VIEWS = new Set(['hub', 'flash', 'trade', 'burn', 'turbine'])
const STAKING_VIEWS = new Set(['hub', 'stake', 'lpbond', 'burnbond', 'xmine', 'calc'])
const ASSETS_VIEWS = new Set(['hub', 'stake', 'lpbond', 'burnbond', 'xmine'])
const REWARDS_VIEWS = new Set([
  'hub',
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
])
const RELEASE_VIEWS = new Set(['hub', 'queue', 'buffer'])

function emptyViews(tab, patch = {}) {
  return {
    tab,
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
    releaseView: null,
    ...patch,
  }
}

function dappLocationFromHash(hash) {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return emptyViews('exchange', { exchangeView: 'hub' })
  const [tabPart, viewPart] = raw.split('/')
  if (!tabOrder.includes(tabPart)) return null
  if (tabPart === 'exchange') {
    if (!viewPart) return emptyViews('exchange')
    if (!EXCHANGE_VIEWS.has(viewPart)) return emptyViews('exchange', { exchangeView: 'hub' })
    return emptyViews('exchange', { exchangeView: viewPart })
  }
  if (tabPart === 'staking') {
    if (!viewPart) return emptyViews('staking')
    if (!STAKING_VIEWS.has(viewPart)) return emptyViews('staking', { stakingView: 'hub' })
    return emptyViews('staking', { stakingView: viewPart })
  }
  if (tabPart === 'assets') {
    if (!viewPart) return emptyViews('assets')
    if (!ASSETS_VIEWS.has(viewPart)) return emptyViews('assets', { assetsView: 'hub' })
    return emptyViews('assets', { assetsView: viewPart })
  }
  if (tabPart === 'rewards') {
    if (!viewPart) return emptyViews('rewards')
    if (!REWARDS_VIEWS.has(viewPart)) return emptyViews('rewards', { rewardsView: 'hub' })
    return emptyViews('rewards', { rewardsView: viewPart })
  }
  if (tabPart === 'release') {
    if (!viewPart) return emptyViews('release')
    if (viewPart === 'rewards' || !RELEASE_VIEWS.has(viewPart)) {
      return emptyViews('release', { releaseView: 'hub' })
    }
    return emptyViews('release', { releaseView: viewPart })
  }
  return emptyViews(tabPart)
}

const empty = {
  exchangeView: null,
  stakingView: null,
  assetsView: null,
  rewardsView: null,
  releaseView: null,
}

test('EX-B4 deep link resolves exchange/burn', () => {
  assert.deepEqual(dappLocationFromHash('exchange/burn'), {
    tab: 'exchange',
    ...empty,
    exchangeView: 'burn',
  })
  assert.deepEqual(dappLocationFromHash('#exchange/turbine'), {
    tab: 'exchange',
    ...empty,
    exchangeView: 'turbine',
  })
  assert.deepEqual(dappLocationFromHash('swap'), {
    tab: 'exchange',
    ...empty,
    exchangeView: 'hub',
  })
  assert.deepEqual(dappLocationFromHash('genesis'), {
    tab: 'genesis',
    ...empty,
  })
})

test('staking deep link resolves hub and subviews', () => {
  assert.deepEqual(dappLocationFromHash('staking'), {
    tab: 'staking',
    ...empty,
  })
  assert.deepEqual(dappLocationFromHash('#staking/stake'), {
    tab: 'staking',
    ...empty,
    stakingView: 'stake',
  })
  assert.deepEqual(dappLocationFromHash('staking/nope'), {
    tab: 'staking',
    ...empty,
    stakingView: 'hub',
  })
})

test('assets deep link resolves hub and subviews', () => {
  assert.deepEqual(dappLocationFromHash('assets'), {
    tab: 'assets',
    ...empty,
  })
  assert.deepEqual(dappLocationFromHash('#assets/stake'), {
    tab: 'assets',
    ...empty,
    assetsView: 'stake',
  })
  assert.deepEqual(dappLocationFromHash('assets/nope'), {
    tab: 'assets',
    ...empty,
    assetsView: 'hub',
  })
})

test('rewards deep link resolves hub and six cards', () => {
  assert.deepEqual(dappLocationFromHash('rewards'), {
    tab: 'rewards',
    ...empty,
  })
  assert.deepEqual(dappLocationFromHash('#rewards/lucky'), {
    tab: 'rewards',
    ...empty,
    rewardsView: 'lucky',
  })
  assert.deepEqual(dappLocationFromHash('rewards/legacy'), {
    tab: 'rewards',
    ...empty,
    rewardsView: 'hub',
  })
})

test('release deep link resolves hub|queue|buffer and rejects rewards subview name', () => {
  assert.deepEqual(dappLocationFromHash('release'), {
    tab: 'release',
    ...empty,
  })
  assert.deepEqual(dappLocationFromHash('#release/queue'), {
    tab: 'release',
    ...empty,
    releaseView: 'queue',
  })
  assert.deepEqual(dappLocationFromHash('release/buffer'), {
    tab: 'release',
    ...empty,
    releaseView: 'buffer',
  })
  assert.deepEqual(dappLocationFromHash('release/rewards'), {
    tab: 'release',
    ...empty,
    releaseView: 'hub',
  })
  assert.deepEqual(dappLocationFromHash('release/nope'), {
    tab: 'release',
    ...empty,
    releaseView: 'hub',
  })
})
