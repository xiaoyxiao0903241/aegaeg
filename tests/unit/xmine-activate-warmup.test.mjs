import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('evaluateXmineActivateWarmup fail-closed before end / after ready', async () => {
  const { evaluateXmineActivateWarmup } = await loadModule(
    '/src/core/assets/assets-block-reasons.ts',
  )

  assert.equal(
    evaluateXmineActivateWarmup({ warmupGons: 0n, warmupEndTime: 100n, nowSec: 200 }),
    'noWarmup',
  )
  assert.equal(
    evaluateXmineActivateWarmup({ warmupGons: 1n, warmupEndTime: 100n, nowSec: 50 }),
    'warmupNotEnded',
  )
  assert.equal(
    evaluateXmineActivateWarmup({ warmupGons: 1n, warmupEndTime: 100n, nowSec: 100 }),
    null,
  )
  assert.equal(
    evaluateXmineActivateWarmup({ warmupGons: 1n, warmupEndTime: 100n, nowSec: 101 }),
    null,
  )
})
