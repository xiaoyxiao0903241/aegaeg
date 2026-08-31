import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('calcSliderPct: 1 is inner-left; 180 is about one third of 540', async () => {
  const { calcSliderPct } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  assert.equal(calcSliderPct(1, 540), 0)
  assert.equal(calcSliderPct(5, 540), (4 / 539) * 100)
  assert.equal(calcSliderPct(180, 540), (179 / 539) * 100)
  assert.equal(calcSliderPct(540, 540), 100)
})

test('calcSliderDayFromRatio: pads clamp to min/max; inner maps 1…540', async () => {
  const { calcSliderDayFromRatio } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  assert.equal(calcSliderDayFromRatio(-0.2, 540), 1)
  assert.equal(calcSliderDayFromRatio(0, 540), 1)
  assert.equal(calcSliderDayFromRatio(1, 540), 540)
  assert.equal(calcSliderDayFromRatio(1.4, 540), 540)
  assert.equal(calcSliderDayFromRatio(4 / 539, 540), 5)
})

test('calcSliderCaptionVis: edge is tick-only; under thumb is hidden', async () => {
  const { calcSliderCaptionVis } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  assert.deepEqual(calcSliderCaptionVis(5, 540, 100), { tick: true, label: false })
  assert.deepEqual(calcSliderCaptionVis(5, 540, 1), { tick: false, label: false })
  assert.deepEqual(calcSliderCaptionVis(100, 540, 1), { tick: true, label: true })
  assert.deepEqual(calcSliderCaptionVis(100, 540, 100), { tick: false, label: false })
  assert.deepEqual(calcSliderCaptionVis(530, 540, 100), { tick: true, label: false })
})

test('calcSliderMarks: axis is always 1…540; liquid has no maturity', async () => {
  const { calcSliderMarks } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  const marks = calcSliderMarks({ period: 'liquid', breakEvenDay: 12 })
  assert.deepEqual(marks, { minDay: 1, maxDay: 540, maturityDay: null, breakEvenDay: 12 })
})

test('calcSliderMarks: 360 keeps left at 1 and marks maturity at 360', async () => {
  const { calcSliderMarks } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  const marks = calcSliderMarks({ period: '360', breakEvenDay: 100 })
  assert.equal(marks.minDay, 1)
  assert.equal(marks.maxDay, 540)
  assert.equal(marks.maturityDay, 360)
  assert.equal(marks.breakEvenDay, 100)
})

test('calcSliderMarks: 540 has no separate maturity tick', async () => {
  const { calcSliderMarks } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  const marks = calcSliderMarks({ period: '540', breakEvenDay: 80 })
  assert.equal(marks.maturityDay, null)
  assert.equal(marks.breakEvenDay, 80)
})

test('snapCalcSliderDay: snaps onto nearby maturity or break-even', async () => {
  const { snapCalcSliderDay } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  const marks = { minDay: 1, maxDay: 540, maturityDay: 360, breakEvenDay: 100 }
  assert.equal(snapCalcSliderDay(352, marks), 360)
  assert.equal(snapCalcSliderDay(351, marks), 351)
  assert.equal(snapCalcSliderDay(105, marks), 100)
})

test('snapCalcSliderDay: keeps min and max even when a tick is nearby', async () => {
  const { snapCalcSliderDay } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  const marks = { minDay: 1, maxDay: 540, maturityDay: null, breakEvenDay: 5 }
  assert.equal(snapCalcSliderDay(1, marks), 1)
  assert.equal(snapCalcSliderDay(4, marks), 5)
  assert.equal(snapCalcSliderDay(540, marks), 540)
})

test('showCalcSliderTrackDay: hides end-adjacent and thumb-covered days', async () => {
  const { showCalcSliderTrackDay } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  assert.equal(showCalcSliderTrackDay(360, 540, 100), true)
  assert.equal(showCalcSliderTrackDay(360, 540, 360), false)
  assert.equal(showCalcSliderTrackDay(10, 540, 100), false)
  assert.equal(showCalcSliderTrackDay(1, 540, 100), false)
})
