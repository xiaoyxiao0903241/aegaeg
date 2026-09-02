import assert from 'node:assert/strict'
import test from 'node:test'

import {
  easeOutCubic,
  ensureAscendingTimes,
  morphSeriesFrame,
  sampleSeriesNormalized,
} from '../../../src/shared/lib/chart-series-morph.ts'

test('sampleSeriesNormalized hits ends and midpoints', () => {
  const points = [
    { time: 100, value: 10 },
    { time: 200, value: 20 },
    { time: 300, value: 30 },
  ]
  assert.deepEqual(sampleSeriesNormalized(points, 0), { time: 100, value: 10 })
  assert.deepEqual(sampleSeriesNormalized(points, 1), { time: 300, value: 30 })
  assert.deepEqual(sampleSeriesNormalized(points, 0.5), { time: 200, value: 20 })
})

test('morphSeriesFrame progress 0/1 returns endpoints; mid blends values', () => {
  const from = [
    { time: 10, value: 0 },
    { time: 20, value: 0 },
  ]
  const to = [
    { time: 100, value: 100 },
    { time: 200, value: 200 },
  ]
  assert.deepEqual(morphSeriesFrame(from, to, 0), from)
  assert.deepEqual(morphSeriesFrame(from, to, 1), to)

  const mid = morphSeriesFrame(from, to, 0.5, 2)
  assert.equal(mid.length, 2)
  assert.equal(mid[0].value, 50)
  assert.equal(mid[1].value, 100)
  assert.ok(mid[0].time < mid[1].time)
})

test('ensureAscendingTimes nudges non-increasing times', () => {
  const fixed = ensureAscendingTimes([
    { time: 5, value: 1 },
    { time: 5, value: 2 },
    { time: 4, value: 3 },
  ])
  assert.deepEqual(
    fixed.map((p) => p.time),
    [5, 6, 7],
  )
})

test('morphSeriesFrame equal-length series keeps point count and blends values', () => {
  const from = [
    { time: 1, value: 0 },
    { time: 2, value: 10 },
    { time: 3, value: 20 },
  ]
  const to = [
    { time: 1, value: 100 },
    { time: 2, value: 200 },
    { time: 3, value: 300 },
  ]
  const mid = morphSeriesFrame(from, to, 0.5)
  assert.equal(mid.length, 3)
  assert.equal(mid[0].time, 1)
  assert.equal(mid[1].time, 2)
  assert.equal(mid[2].time, 3)
  assert.equal(mid[0].value, 50)
  assert.equal(mid[1].value, 105)
  assert.equal(mid[2].value, 160)
})

test('easeOutCubic bounds', () => {
  assert.equal(easeOutCubic(0), 0)
  assert.equal(easeOutCubic(1), 1)
  assert.ok(easeOutCubic(0.5) > 0.5)
})
