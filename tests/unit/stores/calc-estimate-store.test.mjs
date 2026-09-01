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

test('setProduct xmine resets period to liquid', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'lpbond',
    period: '360',
    amount: '1',
    price: '80',
    spotUsd: 80,
    days: 100,
    rates: null,
    result: null,
  })
  useCalcEstimateStore.getState().setProduct('xmine')
  assert.equal(useCalcEstimateStore.getState().product, 'xmine')
  assert.equal(useCalcEstimateStore.getState().period, 'liquid')
})

test('setPeriod on ready stake rewrites the right-hand snapshot', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'stake',
    period: 'liquid',
    amount: '1',
    price: '80',
    spotUsd: 80,
    days: 100,
    rates: { epochRebasePct: 0.41, xmineDailyPct: null, epochsPerDay: 2, discountRateBP: null },
    result: null,
  })
  useCalcEstimateStore.getState().commit()
  const first = useCalcEstimateStore.getState().result
  assert.ok(first)
  assert.equal(first.period, 'liquid')

  useCalcEstimateStore.getState().setPeriod('180')
  const next = useCalcEstimateStore.getState().result
  assert.ok(next)
  assert.equal(next.period, '180')
  assert.notEqual(next, first)
})

test('setProduct to xmine with live daily pct rewrites snapshot', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'stake',
    period: '180',
    amount: '1',
    price: '80',
    spotUsd: 80,
    days: 100,
    rates: { epochRebasePct: 0.41, xmineDailyPct: 0.1, epochsPerDay: 2, discountRateBP: null },
    result: null,
  })
  useCalcEstimateStore.getState().commit()
  assert.equal(useCalcEstimateStore.getState().result?.product, 'stake')

  useCalcEstimateStore.getState().setProduct('xmine')
  const next = useCalcEstimateStore.getState().result
  assert.ok(next)
  assert.equal(next.product, 'xmine')
  assert.equal(next.period, 'liquid')
  assert.equal(next.price, 0.02)
})

test('setPeriod on bond keeps last snapshot until the new discount arrives', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'lpbond',
    period: '180',
    amount: '65000',
    price: '80',
    spotUsd: 80,
    days: 180,
    rates: { epochRebasePct: 0.41, xmineDailyPct: null, epochsPerDay: 2, discountRateBP: 9200 },
    result: null,
  })
  useCalcEstimateStore.getState().commit()
  const prev = useCalcEstimateStore.getState().result
  assert.ok(prev)
  assert.equal(prev.period, '180')

  useCalcEstimateStore.getState().setPeriod('360')
  assert.equal(useCalcEstimateStore.getState().period, '360')
  assert.equal(useCalcEstimateStore.getState().result, prev)
  assert.equal(useCalcEstimateStore.getState().rates?.discountRateBP, null)

  useCalcEstimateStore.getState().liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
    discountRateBP: 8000,
  })
  const next = useCalcEstimateStore.getState().result
  assert.ok(next)
  assert.equal(next.period, '360')
  assert.equal(next.discountRateBP, 8000)
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
    discountRateBP: null,
  })
  const filled = useCalcEstimateStore.getState().result
  assert.ok(filled)
  assert.equal(filled.epochRebasePct, 0.41)
})

test('bond liveSync waits for live discountRateBP', async () => {
  const { useCalcEstimateStore } = await loadModule('/src/stores/calc-estimate-store.ts')

  useCalcEstimateStore.setState({
    product: 'lpbond',
    period: '180',
    amount: '65000',
    price: '80',
    spotUsd: 80,
    days: 180,
    rates: null,
    result: null,
  })

  const store = useCalcEstimateStore.getState()
  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
    discountRateBP: null,
  })
  assert.equal(useCalcEstimateStore.getState().result, null)

  store.liveSync({
    epochRebasePct: 0.41,
    xmineDailyPct: null,
    epochsPerDay: 2,
    discountRateBP: 9200,
  })
  const first = useCalcEstimateStore.getState().result
  assert.ok(first)
  assert.equal(first.discountRateBP, 9200)
  assert.ok(Math.abs(first.ratePct - (1.0041 ** 360 / 0.92 - 1) * 100) < 1e-6)
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
