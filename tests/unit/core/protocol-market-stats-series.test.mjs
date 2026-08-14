import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildProtocolMarketStatsChart,
  parseProtocolMarketStatsDate,
  protocolMarketStatsAggregateUnit,
  resolveProtocolMarketStatsAggregateMetric,
  resolveProtocolMarketStatsMetric,
  resolveProtocolMarketStatsRange,
} from '../../../src/core/staking/protocol-market-stats-series.ts'

test('resolveProtocolMarketStatsRange maps label index to API range', () => {
  const labels = ['1周', '1月', '1年', '全部']
  assert.equal(resolveProtocolMarketStatsRange('1周', labels), 'week')
  assert.equal(resolveProtocolMarketStatsRange('1月', labels), 'month')
  assert.equal(resolveProtocolMarketStatsRange('1年', labels), 'year')
  assert.equal(resolveProtocolMarketStatsRange('全部', labels), 'all')
  assert.equal(resolveProtocolMarketStatsRange('unknown', labels), 'all')
})

test('resolveProtocolMarketStatsMetric maps UI tabs to API metric', () => {
  assert.equal(resolveProtocolMarketStatsMetric('mcap'), 'market')
  assert.equal(resolveProtocolMarketStatsMetric('tvl'), 'stake')
  assert.equal(resolveProtocolMarketStatsMetric('other'), 'stake')
})

test('resolveProtocolMarketStatsAggregateMetric maps detail product to API metric', () => {
  assert.equal(resolveProtocolMarketStatsAggregateMetric('stake'), 'stake')
  assert.equal(resolveProtocolMarketStatsAggregateMetric('lpbond'), 'lp_bond')
  assert.equal(resolveProtocolMarketStatsAggregateMetric('burnbond'), 'burn_bond')
  assert.equal(resolveProtocolMarketStatsAggregateMetric('xmine'), 'x_stake')
})

test('protocolMarketStatsAggregateUnit is AGX except x_stake gAGX', () => {
  assert.equal(protocolMarketStatsAggregateUnit('stake'), 'AGX')
  assert.equal(protocolMarketStatsAggregateUnit('lp_bond'), 'AGX')
  assert.equal(protocolMarketStatsAggregateUnit('burn_bond'), 'AGX')
  assert.equal(protocolMarketStatsAggregateUnit('x_stake'), 'gAGX')
})

test('parseProtocolMarketStatsDate accepts yyyy-MM-dd and unix', () => {
  assert.equal(parseProtocolMarketStatsDate('2026-08-01'), Date.UTC(2026, 7, 1) / 1000)
  assert.equal(parseProtocolMarketStatsDate(1_722_470_400), 1_722_470_400)
  assert.equal(parseProtocolMarketStatsDate(1_722_470_400_000), 1_722_470_400)
  assert.equal(parseProtocolMarketStatsDate(''), null)
  assert.equal(parseProtocolMarketStatsDate('not-a-date'), null)
})

test('buildProtocolMarketStatsChart sorts list and uses API latest_growth_rate', () => {
  const built = buildProtocolMarketStatsChart({
    list: [
      { date: '2026-08-03', amount: '120' },
      { date: 'bad', amount: '9' },
      { date: '2026-08-01', amount: '100' },
      { date: '2026-08-02', amount: 'not-a-number' },
    ],
    latest_growth_rate: 7.5,
  })
  assert.deepEqual(
    built.points.map((p) => ({ time: p.time, value: p.value })),
    [
      { time: Date.UTC(2026, 7, 1) / 1000, value: 100 },
      { time: Date.UTC(2026, 7, 3) / 1000, value: 120 },
    ],
  )
  assert.equal(built.lastValue, 120)
  assert.equal(built.percentChange, 7.5)
})

test('buildProtocolMarketStatsChart empty / null growth → null headers', () => {
  const built = buildProtocolMarketStatsChart({ list: [], latest_growth_rate: null })
  assert.deepEqual(built.points, [])
  assert.equal(built.lastValue, null)
  assert.equal(built.percentChange, null)
})

test('buildProtocolMarketStatsChart missing payload → empty chart', () => {
  const built = buildProtocolMarketStatsChart(undefined)
  assert.deepEqual(built.points, [])
  assert.equal(built.lastValue, null)
  assert.equal(built.percentChange, null)
})
