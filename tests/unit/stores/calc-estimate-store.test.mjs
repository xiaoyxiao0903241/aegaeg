import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('store defaults to stake/liquid/day 100 with empty AGX price and no fake result', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')
  const s = useCalcEstimateStore.getState()
  assert.equal(s.product, 'stake')
  assert.equal(s.period, 'liquid')
  assert.equal(s.days, 100)
  assert.equal(s.price, '')
  assert.equal(s.spotUsd, null)
  assert.equal(s.result, null)
})

test('liveSync waits for rates then writes first snapshot; later ticks do not rewrite', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'stake',
    period: 'liquid',
    amount: '1',
    price: '80',
    spotUsd: 80,
    days: 100,
    rates: null,
    result: null,
  })

  const store = useCalcEstimateStore.getState()
  store.liveSync({
    epochRebasePct: null,
    xmineDailyPct: null,
    epochsPerDay: null,
  })
  assert.equal(useCalcEstimateStore.getState().result, null)
  assert.equal(useCalcEstimateStore.getState().price, '80')

  store.commit()
  assert.equal(useCalcEstimateStore.getState().result, null)

  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  const first = useCalcEstimateStore.getState().result
  assert.ok(first)
  assert.equal(first.days, 100)
  assert.equal(first.epochRebasePct, 0.41)
  assert.ok(first.profitUsd > 0)

  store.liveSync({
    epochRebasePct: 0.5,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  assert.equal(useCalcEstimateStore.getState().result, first)

  useCalcEstimateStore.getState().setDays(90)
  assert.equal(useCalcEstimateStore.getState().result?.days, 100)
  useCalcEstimateStore.getState().commit()
  assert.equal(useCalcEstimateStore.getState().result?.days, 90)
})

test('xmine liveSync waits for on-chain daily pct', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'xmine',
    period: 'liquid',
    amount: '1',
    price: '0.02',
    spotUsd: 80,
    days: 100,
    rates: null,
    result: null,
  })

  const store = useCalcEstimateStore.getState()
  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  assert.equal(useCalcEstimateStore.getState().result, null)

  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: 0.1,
    epochsPerDay: 2,
  })
  const first = useCalcEstimateStore.getState().result
  assert.ok(first)
  assert.equal(first.xmineDailyPct, 0.1)
})

test('empty AGX price blocks first snapshot until setPrice', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'stake',
    period: 'liquid',
    amount: '1',
    price: '',
    spotUsd: 80,
    days: 100,
    rates: null,
    result: null,
  })

  const store = useCalcEstimateStore.getState()
  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  assert.equal(useCalcEstimateStore.getState().result, null)

  store.commit()
  assert.equal(useCalcEstimateStore.getState().result, null)

  useCalcEstimateStore.getState().setPrice('80')
  const first = useCalcEstimateStore.getState().result
  assert.ok(first)
  assert.equal(first.price, 80)
  assert.equal(first.spotUsd, 80)
  assert.equal(first.investedUsd, 80)
})

test('liveSync keeps result empty until rebase rate is ready', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'stake',
    period: 'liquid',
    amount: '1',
    price: '80',
    spotUsd: 80,
    days: 100,
    rates: null,
    result: null,
  })

  const store = useCalcEstimateStore.getState()
  store.liveSync({
    epochRebasePct: null,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  assert.equal(useCalcEstimateStore.getState().result, null)

  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  const filled = useCalcEstimateStore.getState().result
  assert.ok(filled)
  assert.equal(filled.epochRebasePct, 0.41)
})

test('missing spotUsd blocks snapshot even with price and rates', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'stake',
    period: 'liquid',
    amount: '1',
    price: '80',
    spotUsd: null,
    days: 100,
    rates: null,
    result: null,
  })

  const store = useCalcEstimateStore.getState()
  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
  })
  assert.equal(useCalcEstimateStore.getState().result, null)

  store.commit()
  assert.equal(useCalcEstimateStore.getState().result, null)

  useCalcEstimateStore.getState().setSpotUsd(80)
  const first = useCalcEstimateStore.getState().result
  assert.ok(first)
  assert.equal(first.investedUsd, 80)
})
