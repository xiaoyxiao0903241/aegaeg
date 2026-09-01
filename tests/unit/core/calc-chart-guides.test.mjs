import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('buildCalcChartGuides: 180d labels selected + period + 540, no break-even', async () => {
  const { buildCalcChartGuides } = await loadModule('/src/core/staking/calc-chart-guides.ts')
  const points = Array.from({ length: 540 }, (_, i) => ({ day: i + 1, profitUsd: (i + 1) * 10 }))
  const guides = buildCalcChartGuides({
    points,
    period: '180',
    selectedDay: 100,
  })
  const byKind = Object.fromEntries(guides.map((g) => [g.kind, g]))
  assert.equal(byKind.selected.day, 100)
  assert.equal(byKind.selected.showPrice, true)
  assert.equal(byKind.selected.vertical, false)
  assert.equal(byKind.selected.marker, 'none')
  assert.equal(byKind.period.day, 180)
  assert.equal(byKind.period.marker, 'hollow')
  assert.equal(byKind.period.vertical, true)
  assert.equal(byKind.period.showPill, true)
  assert.equal(byKind.horizon.day, 540)
  assert.equal(byKind.horizon.marker, 'hollow')
  assert.equal(byKind.horizon.vertical, false)
  assert.equal(
    guides.some((g) => g.kind === 'breakEven'),
    false,
  )
})

test('buildCalcChartGuides: liquid has selected + 540, no period vert', async () => {
  const { buildCalcChartGuides } = await loadModule('/src/core/staking/calc-chart-guides.ts')
  const points = Array.from({ length: 540 }, (_, i) => ({ day: i + 1, profitUsd: i }))
  const guides = buildCalcChartGuides({
    points,
    period: 'liquid',
    selectedDay: 100,
  })
  assert.equal(
    guides.some((g) => g.vertical),
    false,
  )
  assert.equal(guides.find((g) => g.kind === 'selected')?.showPrice, true)
  assert.equal(guides.filter((g) => g.kind === 'horizon').length, 1)
  assert.equal(guides.find((g) => g.kind === 'horizon')?.marker, 'hollow')
})

test('buildCalcChartGuides: period 540 merges with horizon and keeps vert', async () => {
  const { buildCalcChartGuides } = await loadModule('/src/core/staking/calc-chart-guides.ts')
  const points = Array.from({ length: 540 }, (_, i) => ({ day: i + 1, profitUsd: i }))
  const guides = buildCalcChartGuides({
    points,
    period: '540',
    selectedDay: 100,
  })
  assert.equal(guides.map((g) => g.kind).join(','), 'selected,horizon')
  assert.equal(guides[1].day, 540)
  assert.equal(guides[1].vertical, true)
  assert.equal(guides[1].marker, 'hollow')
})

test('buildCalcChartGuides: selected on period day drops hollow and extra selected guide', async () => {
  const { buildCalcChartGuides } = await loadModule('/src/core/staking/calc-chart-guides.ts')
  const points = Array.from({ length: 540 }, (_, i) => ({ day: i + 1, profitUsd: i }))
  const guides = buildCalcChartGuides({
    points,
    period: '180',
    selectedDay: 180,
  })
  assert.equal(
    guides.some((g) => g.kind === 'selected'),
    false,
  )
  const period = guides.find((g) => g.kind === 'period')
  assert.ok(period)
  assert.equal(period.marker, 'none')
  assert.equal(period.showPill, false)
  assert.equal(period.showPrice, true)
  assert.equal(period.vertical, true)
})
