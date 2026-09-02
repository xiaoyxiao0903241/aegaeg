import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('nextTierProgress targets the next rank thresholds', async () => {
  const { nextTierProgress } = await loadModule('/src/core/presale/tier-progress.ts')

  const progress = nextTierProgress(2, 1200, 8200)

  assert.equal(progress.nextRank, 3)
  assert.equal(progress.personalTargetUsd, 2000)
  assert.equal(progress.personalRemainingUsd, 800)
  assert.equal(progress.teamTargetUsd, 30000)
  assert.equal(progress.teamRemainingUsd, 21800)
  assert.equal(progress.teamLegRank, null)
})

test('nextTierProgress uses leg requirements from S4 onward', async () => {
  const { nextTierProgress } = await loadModule('/src/core/presale/tier-progress.ts')

  const progress = nextTierProgress(3, 2500, 35000)

  assert.equal(progress.nextRank, 4)
  assert.equal(progress.personalTargetUsd, 3000)
  assert.equal(progress.teamTargetUsd, null)
  assert.equal(progress.teamLegRank, 3)
  assert.equal(progress.teamProgressPercent, null)
})

test('nextTierProgress marks S10 as max rank', async () => {
  const { nextTierProgress } = await loadModule('/src/core/presale/tier-progress.ts')

  const progress = nextTierProgress(10, 20_000, 100_000)

  assert.equal(progress.isMaxRank, true)
  assert.equal(progress.personalProgressPercent, 100)
  assert.equal(progress.teamLegRank, 9)
})

test('nextTierProgress uses ascending leg requirements from S7 onward', async () => {
  const { nextTierProgress } = await loadModule('/src/core/presale/tier-progress.ts')

  const progress = nextTierProgress(6, 12_000, 100_000)

  assert.equal(progress.nextRank, 7)
  assert.equal(progress.personalTargetUsd, 10_000)
  assert.equal(progress.teamLegRank, 6)
  assert.equal(progress.teamTargetUsd, null)
})
