import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('evaluateXmineActivateWarmupGate fail-closed before end / after ready', async () => {
  const { evaluateXmineActivateWarmupGate } = await loadModule('/src/core/assets/assets-gates.ts')

  assert.equal(
    evaluateXmineActivateWarmupGate({ warmupGons: 0n, warmupEndTime: 100n, nowSec: 200 }),
    'noWarmup',
  )
  assert.equal(
    evaluateXmineActivateWarmupGate({ warmupGons: 1n, warmupEndTime: 100n, nowSec: 50 }),
    'warmupNotEnded',
  )
  assert.equal(
    evaluateXmineActivateWarmupGate({ warmupGons: 1n, warmupEndTime: 100n, nowSec: 100 }),
    null,
  )
  assert.equal(
    evaluateXmineActivateWarmupGate({ warmupGons: 1n, warmupEndTime: 100n, nowSec: 101 }),
    null,
  )
})
