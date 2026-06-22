import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('presale config matches deployment env snapshot', async () => {
  const { PRESALE_CONFIG } = await loadModule('/src/config/presale.ts')

  assert.equal(PRESALE_CONFIG.phaseCount, 3)
  assert.equal(PRESALE_CONFIG.phaseDurationSeconds, 259_200)
  assert.equal(PRESALE_CONFIG.agxPriceUsd, '55')
  assert.equal(PRESALE_CONFIG.sharePriceUsd1, '100')
  assert.deepEqual(
    PRESALE_CONFIG.phases.map((phase) => phase.discountBps),
    [3000, 2500, 2000],
  )
  assert.deepEqual(
    PRESALE_CONFIG.phases.map((phase) => phase.minUsd1),
    ['100', '100', '100'],
  )
  assert.deepEqual(
    PRESALE_CONFIG.phases.map((phase) => phase.maxUsd1),
    ['10000', '20000', '30000'],
  )
})
