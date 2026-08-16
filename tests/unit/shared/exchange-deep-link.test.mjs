import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const empty = {
  exchangeView: null,
  stakingView: null,
  assetsView: null,
  rewardsView: null,
  releaseView: null,
}

test('EX-B4 deep link resolves exchange/burn', async () => {
  const { dappLocationFromHash } = await loadModule('/src/shared/config/dapp-deep-links.ts')

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

test('staking deep link resolves hub and subviews', async () => {
  const { dappLocationFromHash } = await loadModule('/src/shared/config/dapp-deep-links.ts')

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

test('assets deep link resolves hub and subviews', async () => {
  const { dappLocationFromHash } = await loadModule('/src/shared/config/dapp-deep-links.ts')

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

test('rewards deep link resolves hub and six cards', async () => {
  const { dappLocationFromHash } = await loadModule('/src/shared/config/dapp-deep-links.ts')

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

test('release deep link resolves hub|queue|buffer and rejects rewards subview name', async () => {
  const { dappLocationFromHash } = await loadModule('/src/shared/config/dapp-deep-links.ts')

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
