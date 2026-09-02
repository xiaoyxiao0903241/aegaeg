import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('sumTurbineSilenceBuckets splits cooling vs claimable by isVested', async () => {
  const { sumTurbineSilenceBuckets } = await loadModule(
    '/src/core/exchange/turbine-silence-buckets.ts',
  )

  const empty = sumTurbineSilenceBuckets([])
  assert.equal(empty.cooling, 0n)
  assert.equal(empty.claimable, 0n)

  const split = sumTurbineSilenceBuckets([
    { silenceBalance: 100n, vested: false },
    { silenceBalance: 40n, vested: true },
    { silenceBalance: 10n, vested: false },
    { silenceBalance: 5n, vested: true },
  ])
  assert.equal(split.cooling, 110n)
  assert.equal(split.claimable, 45n)
})
