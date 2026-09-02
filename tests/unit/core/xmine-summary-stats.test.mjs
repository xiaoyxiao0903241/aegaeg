import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const X_DECIMALS = 18
const GAGX_DECIMALS = 9
const ONE_X = 10n ** 18n
const ONE_GAGX = 10n ** 9n

test('xmineSummaryAmountWei: decimal string', async () => {
  const { xmineSummaryAmountWei } = await loadModule('/src/core/assets/xmine-summary-stats.ts')

  assert.equal(xmineSummaryAmountWei('1', GAGX_DECIMALS), ONE_GAGX)
  assert.equal(xmineSummaryAmountWei('1.5', GAGX_DECIMALS), (3n * ONE_GAGX) / 2n)
  assert.equal(xmineSummaryAmountWei('0', X_DECIMALS), 0n)
  assert.equal(xmineSummaryAmountWei('1', X_DECIMALS), ONE_X)
})

test('xmineSummaryAmountWei: missing or invalid → null', async () => {
  const { xmineSummaryAmountWei } = await loadModule('/src/core/assets/xmine-summary-stats.ts')

  assert.equal(xmineSummaryAmountWei(null, GAGX_DECIMALS), null)
  assert.equal(xmineSummaryAmountWei(undefined, GAGX_DECIMALS), null)
  assert.equal(xmineSummaryAmountWei('', GAGX_DECIMALS), null)
  assert.equal(xmineSummaryAmountWei('nope', GAGX_DECIMALS), null)
  assert.equal(xmineSummaryAmountWei('-1', GAGX_DECIMALS), null)
})

test('assets xmine stats use summary fields without adding pending', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/xmine/use-xmine.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /xmineSummaryAmountWei/)
  assert.match(src, /claimed_x_reward/)
  assert.match(src, /useX0MiningSummary/)
  assert.doesNotMatch(src, /xmineTotalOutputWei/)
  assert.doesNotMatch(src, /pendingWei/)
  assert.doesNotMatch(src, /useX0MiningLifetimeReward/)
})
