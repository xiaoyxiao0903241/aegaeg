import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CHART_INSET_PAD_PX,
  chartVisibleLogicalRange,
} from '../../../src/shared/lib/chart-visible-range.ts'

test('chartVisibleLogicalRange flush crops half-bar so ends sit on the edge', () => {
  assert.equal(chartVisibleLogicalRange(0), null)
  assert.deepEqual(chartVisibleLogicalRange(1, 'flush'), { from: 0, to: 1 })
  assert.deepEqual(chartVisibleLogicalRange(10, 'flush'), { from: 0.5, to: 8.5 })
})

test('chartVisibleLogicalRange inset pads by pixels, not a fraction of a bar', () => {
  assert.deepEqual(chartVisibleLogicalRange(1, 'inset'), { from: -0.5, to: 1.5 })
  const width = 400
  const n = 10
  const last = n - 1
  const padBars = (CHART_INSET_PAD_PX * last) / (width - 2 * CHART_INSET_PAD_PX)
  assert.deepEqual(chartVisibleLogicalRange(n, 'inset', width), {
    from: -padBars,
    to: last + padBars,
  })
})

test('chartVisibleLogicalRange inset stays hoverable on a 540-point calc curve', () => {
  const width = 400
  const n = 540
  const last = n - 1
  const padBars = (CHART_INSET_PAD_PX * last) / (width - 2 * CHART_INSET_PAD_PX)
  const range = chartVisibleLogicalRange(n, 'inset', width)
  assert.ok(range)
  assert.equal(range.from, -padBars)
  assert.equal(range.to, last + padBars)
  // 0.35 槽在此密度下不足 1px；像素留白必须换算出远大于 1 的逻辑槽
  assert.ok(padBars > 10)
})
