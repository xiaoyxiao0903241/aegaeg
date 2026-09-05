import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const DECIMALS = 9
const UNIT = 10n ** BigInt(DECIMALS)

test('formatContributionPoints floors to 4 digits; dust becomes 0.0000', async () => {
  const { formatContributionPoints } = await loadModule(
    '/src/core/exchange/format-contribution-points.ts',
  )

  assert.equal(formatContributionPoints(0n, DECIMALS), '0.0000')
  assert.equal(formatContributionPoints(null, DECIMALS), '--')
  assert.equal(formatContributionPoints(undefined, DECIMALS), '--')
  assert.equal(formatContributionPoints(6n * UNIT, DECIMALS), '6.0000')
  assert.equal(formatContributionPoints((12345n * UNIT) / 10_000n, DECIMALS), '1.2345')
  // 1.23456 → 1.2345
  assert.equal(formatContributionPoints((123456n * UNIT) / 100_000n, DECIMALS), '1.2345')
  assert.equal(formatContributionPoints(1n, DECIMALS), '0.0000')
  assert.equal(formatContributionPoints(1234n * UNIT, DECIMALS), '1,234.0000')
})

test('formatContributionConsumedTotal ceils to 4 digits; dust becomes 0.0001', async () => {
  const { formatContributionConsumedTotal } = await loadModule(
    '/src/core/exchange/format-contribution-points.ts',
  )

  assert.equal(formatContributionConsumedTotal(0n, DECIMALS), '0.0000')
  assert.equal(formatContributionConsumedTotal((12345n * UNIT) / 10_000n, DECIMALS), '1.2345')
  // 1.23456 → 1.2346
  assert.equal(formatContributionConsumedTotal((123456n * UNIT) / 100_000n, DECIMALS), '1.2346')
  assert.equal(formatContributionConsumedTotal(1n, DECIMALS), '0.0001')
  // 9.99999 → 10.0000
  assert.equal(formatContributionConsumedTotal((999999n * UNIT) / 100_000n, DECIMALS), '10.0000')
})
