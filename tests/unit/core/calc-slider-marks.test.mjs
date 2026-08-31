import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('calcSliderPct: 1 is left; 180 is about one third of 540', async () => {
  const { calcSliderPct } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  assert.equal(calcSliderPct(1, 540), 0)
  assert.equal(calcSliderPct(180, 540), (179 / 539) * 100)
  assert.equal(calcSliderPct(540, 540), 100)
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

test('showCalcSliderTrackDay: hides end-adjacent and thumb-covered days', async () => {
  const { showCalcSliderTrackDay } = await loadModule('/src/core/staking/calc-slider-marks.ts')
  assert.equal(showCalcSliderTrackDay(360, 540, 100), true)
  assert.equal(showCalcSliderTrackDay(360, 540, 360), false)
  assert.equal(showCalcSliderTrackDay(10, 540, 100), false)
  assert.equal(showCalcSliderTrackDay(1, 540, 100), false)
})
