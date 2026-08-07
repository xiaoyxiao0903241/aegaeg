import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildProtocolMarketStatsChart,
  parseProtocolMarketStatsDate,
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

test('parseProtocolMarketStatsDate accepts yyyy-MM-dd and unix', () => {
  assert.equal(parseProtocolMarketStatsDate('2026-08-01'), Date.UTC(2026, 7, 1) / 1000)
  assert.equal(parseProtocolMarketStatsDate(1_722_470_400), 1_722_470_400)
  assert.equal(parseProtocolMarketStatsDate(1_722_470_400_000), 1_722_470_400)
  assert.equal(parseProtocolMarketStatsDate(''), null)
  assert.equal(parseProtocolMarketStatsDate('not-a-date'), null)
})

test('buildProtocolMarketStatsChart sorts, skips bad rows, computes delta', () => {
  const built = buildProtocolMarketStatsChart([
    { date: '2026-08-03', amount: '120' },
    { date: 'bad', amount: '9' },
    { date: '2026-08-01', amount: '100' },
    { date: '2026-08-02', amount: 'not-a-number' },
  ])
  assert.deepEqual(
    built.points.map((p) => ({ time: p.time, value: p.value })),
    [
      { time: Date.UTC(2026, 7, 1) / 1000, value: 100 },
      { time: Date.UTC(2026, 7, 3) / 1000, value: 120 },
    ],
  )
  assert.equal(built.lastValue, 120)
  assert.equal(built.percentChange, 20)
})

test('buildProtocolMarketStatsChart empty → null headers', () => {
  const built = buildProtocolMarketStatsChart([])
  assert.deepEqual(built.points, [])
  assert.equal(built.lastValue, null)
  assert.equal(built.percentChange, null)
})
