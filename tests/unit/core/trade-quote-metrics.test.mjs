import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('formatPriceImpactPercent uses two fraction digits including settled zero', async () => {
  const { formatPriceImpactPercent } = await loadModule('/src/core/exchange/trade-quote-metrics.ts')

  assert.equal(formatPriceImpactPercent(0), '0.00%')
  assert.equal(formatPriceImpactPercent(123), '1.23%')
})

test('formatEstimatedGasBnb shows native BNB cost not gas units', async () => {
  const { formatEstimatedGasBnb } = await loadModule('/src/core/exchange/trade-quote-metrics.ts')

  assert.equal(formatEstimatedGasBnb(0n), '~0 BNB')
  assert.equal(formatEstimatedGasBnb(210_000_000_000_000n), '~0.00021 BNB')
})

test('marketTradeInfoMetricLabel uses dash when unfetched or failed, never empty zero', async () => {
  const { marketTradeInfoMetricLabel, TRADE_METRIC_UNAVAILABLE } = await loadModule(
    '/src/core/exchange/trade-quote-metrics.ts',
  )

  assert.equal(marketTradeInfoMetricLabel(false, '1.00%'), TRADE_METRIC_UNAVAILABLE)
  assert.equal(marketTradeInfoMetricLabel(true, undefined), TRADE_METRIC_UNAVAILABLE)
  assert.equal(marketTradeInfoMetricLabel(true, null), TRADE_METRIC_UNAVAILABLE)
  assert.equal(TRADE_METRIC_UNAVAILABLE, '—')
  assert.equal(marketTradeInfoMetricLabel(true, '0.00%'), '0.00%')
  assert.equal(marketTradeInfoMetricLabel(true, '~0.00021 BNB'), '~0.00021 BNB')
})
