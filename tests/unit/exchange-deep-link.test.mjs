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

function resolveDappLocationFromHash(hash) {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap')
    return {
      tab: 'exchange',
      exchangeView: 'hub',
      stakingView: null,
      assetsView: null,
      rewardsView: null,
    }
  const [tabPart, viewPart] = raw.split('/')
  if (!tabOrder.includes(tabPart)) return null
  if (tabPart === 'exchange') {
    if (!viewPart)
      return {
        tab: 'exchange',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!EXCHANGE_VIEWS.has(viewPart))
      return {
        tab: 'exchange',
        exchangeView: 'hub',
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    return {
      tab: 'exchange',
      exchangeView: viewPart,
      stakingView: null,
      assetsView: null,
      rewardsView: null,
    }
  }
  if (tabPart === 'staking') {
    if (!viewPart)
      return {
        tab: 'staking',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!STAKING_VIEWS.has(viewPart))
      return {
        tab: 'staking',
        exchangeView: null,
        stakingView: 'hub',
        assetsView: null,
        rewardsView: null,
      }
    return {
      tab: 'staking',
      exchangeView: null,
      stakingView: viewPart,
      assetsView: null,
      rewardsView: null,
    }
  }
  if (tabPart === 'assets') {
    if (!viewPart)
      return {
        tab: 'assets',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!ASSETS_VIEWS.has(viewPart))
      return {
        tab: 'assets',
        exchangeView: null,
        stakingView: null,
        assetsView: 'hub',
        rewardsView: null,
      }
    return {
      tab: 'assets',
      exchangeView: null,
      stakingView: null,
      assetsView: viewPart,
      rewardsView: null,
    }
  }
  if (tabPart === 'rewards') {
    if (!viewPart)
      return {
        tab: 'rewards',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!REWARDS_VIEWS.has(viewPart))
      return {
        tab: 'rewards',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: 'hub',
      }
    return {
      tab: 'rewards',
      exchangeView: null,
      stakingView: null,
      assetsView: null,
      rewardsView: viewPart,
    }
  }
  return {
    tab: tabPart,
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  }
}

test('EX-B4 deep link resolves exchange/burn', () => {
  assert.deepEqual(resolveDappLocationFromHash('exchange/burn'), {
    tab: 'exchange',
    exchangeView: 'burn',
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('#exchange/turbine'), {
    tab: 'exchange',
    exchangeView: 'turbine',
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('swap'), {
    tab: 'exchange',
    exchangeView: 'hub',
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('genesis'), {
    tab: 'genesis',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
})

test('staking deep link resolves hub and subviews', () => {
  assert.deepEqual(resolveDappLocationFromHash('staking'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('#staking/stake'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: 'stake',
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('staking/lpbond'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: 'lpbond',
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('staking/nope'), {
    tab: 'staking',
    exchangeView: null,
    stakingView: 'hub',
    assetsView: null,
    rewardsView: null,
  })
})

test('assets deep link resolves hub and subviews', () => {
  assert.deepEqual(resolveDappLocationFromHash('assets'), {
    tab: 'assets',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('#assets/stake'), {
    tab: 'assets',
    exchangeView: null,
    stakingView: null,
    assetsView: 'stake',
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('assets/lpbond'), {
    tab: 'assets',
    exchangeView: null,
    stakingView: null,
    assetsView: 'lpbond',
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('assets/burnbond'), {
    tab: 'assets',
    exchangeView: null,
    stakingView: null,
    assetsView: 'burnbond',
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('assets/xmine'), {
    tab: 'assets',
    exchangeView: null,
    stakingView: null,
    assetsView: 'xmine',
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('assets/nope'), {
    tab: 'assets',
    exchangeView: null,
    stakingView: null,
    assetsView: 'hub',
    rewardsView: null,
  })
})

test('rewards deep link resolves hub and six cards', () => {
  assert.deepEqual(resolveDappLocationFromHash('rewards'), {
    tab: 'rewards',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  })
  assert.deepEqual(resolveDappLocationFromHash('#rewards/lucky'), {
    tab: 'rewards',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: 'lucky',
  })
  assert.deepEqual(resolveDappLocationFromHash('rewards/genesis'), {
    tab: 'rewards',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: 'genesis',
  })
  assert.deepEqual(resolveDappLocationFromHash('rewards/legacy'), {
    tab: 'rewards',
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: 'hub',
  })
})
