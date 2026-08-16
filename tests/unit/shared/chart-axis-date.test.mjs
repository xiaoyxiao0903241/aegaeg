import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CHART_SHORT_SPAN_MAX_S,
  chartDateGrainFromRange,
  chartDateGrainFromSpan,
  formatChartAxisDate,
  formatChartTipDate,
  pickChartAxisLabels,
} from '../../../src/shared/lib/chart-axis-date.ts'

const day = (ymd) => Date.UTC(...ymd) / 1000

test('week/month range grain is day; year/all is month', () => {
  assert.equal(chartDateGrainFromRange('week'), 'day')
  assert.equal(chartDateGrainFromRange('month'), 'day')
  assert.equal(chartDateGrainFromRange('year'), 'month')
  assert.equal(chartDateGrainFromRange('all'), 'month')
})

test('short span (week) axis uses MM-DD, not identical YYYY-MM', () => {
  const points = [
    { time: day([2026, 7, 6]) },
    { time: day([2026, 7, 7]) },
    { time: day([2026, 7, 8]) },
    { time: day([2026, 7, 9]) },
    { time: day([2026, 7, 10]) },
    { time: day([2026, 7, 11]) },
    { time: day([2026, 7, 12]) },
  ]
  const labels = pickChartAxisLabels(points, 6, 'day')
  assert.equal(labels.length, 6)
  assert.equal(labels[0], '08-06')
  assert.equal(labels[labels.length - 1], '08-12')
  assert.ok(labels.every((l) => /^\d{2}-\d{2}$/.test(l)))
  assert.ok(new Set(labels).size > 1)
})

test('short span (month) axis stays day-grained within one calendar month', () => {
  const points = Array.from({ length: 30 }, (_, i) => ({
    time: day([2026, 7, i + 1]),
  }))
  const labels = pickChartAxisLabels(points, 6, 'day')
  assert.equal(labels.length, 6)
  assert.equal(labels[0], '08-01')
  assert.equal(labels[labels.length - 1], '08-30')
  assert.ok(labels.every((l) => /^\d{2}-\d{2}$/.test(l)))
  assert.ok(new Set(labels).size > 1)
})

test('all range forces YYYY-MM even when data span is short', () => {
  const points = [{ time: day([2026, 7, 9]) }, { time: day([2026, 7, 12]) }]
  assert.equal(chartDateGrainFromSpan(points[1].time - points[0].time), 'day')
  const labels = pickChartAxisLabels(points, 6, chartDateGrainFromRange('all'))
  assert.ok(labels.every((l) => /^\d{4}-\d{2}$/.test(l)))
  assert.equal(labels[0], '2026-08')
  assert.equal(labels[labels.length - 1], '2026-08')
})

test('long span (year) axis uses YYYY-MM', () => {
  const points = [
    { time: day([2025, 8, 1]) },
    { time: day([2025, 11, 1]) },
    { time: day([2026, 2, 1]) },
    { time: day([2026, 5, 1]) },
    { time: day([2026, 7, 12]) },
  ]
  const span = points[points.length - 1].time - points[0].time
  assert.ok(span > CHART_SHORT_SPAN_MAX_S)
  assert.deepEqual(pickChartAxisLabels(points, 6, 'month'), [
    '2025-09',
    '2025-12',
    '2026-03',
    '2026-06',
    '2026-08',
  ])
})

test('formatChartAxisDate / tip follow grain', () => {
  const t = day([2026, 7, 12])
  assert.equal(formatChartAxisDate(t, 'day'), '08-12')
  assert.equal(formatChartTipDate(t, 'day'), '2026-08-12')
  assert.equal(formatChartAxisDate(t, 'month'), '2026-08')
  assert.equal(formatChartTipDate(t, 'month'), '2026-08')
})
