import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildNextTierProgress targets the next rank thresholds', async () => {
  const { buildNextTierProgress } = await loadModule('/src/lib/presale/tier-progress.ts')

  const progress = buildNextTierProgress(2, 1200, 8200)

  assert.equal(progress.nextRank, 3)
  assert.equal(progress.personalTargetUsd, 2000)
  assert.equal(progress.personalRemainingUsd, 800)
  assert.equal(progress.teamTargetUsd, 30000)
  assert.equal(progress.teamRemainingUsd, 21800)
  assert.equal(progress.teamLegRank, null)
})

test('buildNextTierProgress uses leg requirements from S4 onward', async () => {
  const { buildNextTierProgress } = await loadModule('/src/lib/presale/tier-progress.ts')

  const progress = buildNextTierProgress(3, 2500, 35000)

  assert.equal(progress.nextRank, 4)
  assert.equal(progress.personalTargetUsd, 3000)
  assert.equal(progress.teamTargetUsd, null)
  assert.equal(progress.teamLegRank, 3)
  assert.equal(progress.teamProgressPercent, null)
})

test('buildNextTierProgress marks S6 as max rank', async () => {
  const { buildNextTierProgress } = await loadModule('/src/lib/presale/tier-progress.ts')

  const progress = buildNextTierProgress(6, 12000, 100000)

  assert.equal(progress.isMaxRank, true)
  assert.equal(progress.personalProgressPercent, 100)
})
