import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const pie = {
  stake: 10,
  lpbond: 5,
  burnbond: 3,
  xmine: 2,
  claimable: 1,
}

test('assetsHubPieHoldingsAmount: four pie positions, no claimable / buffer', async () => {
  const { assetsHubPieHoldingsAmount } = await loadModule(
    '/src/core/assets/assets-hub-total-value.ts',
  )

  assert.equal(assetsHubPieHoldingsAmount(pie), 20)
  assert.equal(
    assetsHubPieHoldingsAmount({
      stake: 0,
      lpbond: 0,
      burnbond: 0,
      xmine: 4,
    }),
    4,
  )
  assert.equal(
    assetsHubPieHoldingsAmount({
      stake: Number.NaN,
      lpbond: 5,
      burnbond: -3,
      xmine: 2,
    }),
    7,
  )
})

test('assetsHubTotalValueUsd: four pie positions + claimable at AGX spot', async () => {
  const { assetsHubTotalValueUsd } = await loadModule('/src/core/assets/assets-hub-total-value.ts')

  assert.equal(assetsHubTotalValueUsd({ ...pie, priceUsd: 10 }), 210)
  assert.equal(
    assetsHubTotalValueUsd({
      stake: 0,
      lpbond: 0,
      burnbond: 0,
      xmine: 0,
      claimable: 2,
      priceUsd: 10,
    }),
    20,
  )
  assert.equal(
    assetsHubTotalValueUsd({
      stake: 3,
      lpbond: 0,
      burnbond: 0,
      xmine: 0,
      claimable: 0,
      priceUsd: 10,
    }),
    30,
  )
  assert.equal(
    assetsHubTotalValueUsd({
      stake: 0,
      lpbond: 0,
      burnbond: 0,
      xmine: 4,
      claimable: 0,
      priceUsd: 10,
    }),
    40,
  )
})

test('assetsHubTotalValueUsd: missing or invalid price → null; price 0 is true zero', async () => {
  const { assetsHubTotalValueUsd } = await loadModule('/src/core/assets/assets-hub-total-value.ts')

  assert.equal(assetsHubTotalValueUsd({ ...pie, priceUsd: null }), null)
  assert.equal(assetsHubTotalValueUsd({ ...pie, priceUsd: undefined }), null)
  assert.equal(assetsHubTotalValueUsd({ ...pie, priceUsd: 0 }), 0)
  assert.equal(assetsHubTotalValueUsd({ ...pie, priceUsd: -1 }), null)
  assert.equal(assetsHubTotalValueUsd({ ...pie, priceUsd: Number.NaN }), null)
  assert.equal(assetsHubTotalValueUsd({ ...pie, stake: Number.NaN, priceUsd: 10 }), 110)
  assert.equal(assetsHubTotalValueUsd({ ...pie, claimable: Number.NaN, priceUsd: 10 }), 200)
  assert.equal(assetsHubTotalValueUsd({ ...pie, stake: -4, priceUsd: 10 }), 110)
  assert.equal(assetsHubTotalValueUsd({ ...pie, claimable: -2, priceUsd: 10 }), 200)
})

test('assets hub overview values total assets from pie positions + claimable', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/hub/use-hub.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /assetsHubTotalValueUsd/)
  assert.doesNotMatch(src, /stake_invest_usd_value/)
  assert.doesNotMatch(
    src,
    /assetsHubTotalValueUsd\(\s*(?:parseApiAmount\(apiHoldings\.total_holdings_agx\)|holdingsTotalNum)/,
  )
})

test('assets hub holdingsTotal uses pie positions, not total_holdings_agx or buffer', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/hub/use-hub.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /assetsHubPieHoldingsAmount/)
  assert.doesNotMatch(src, /total_holdings_agx/)
  assert.doesNotMatch(
    src,
    /holdingsPrincipal = stakePrincipal \+ lpPrincipal \+ burnPrincipal \+ xStake \+ bufferTotal/,
  )
})
