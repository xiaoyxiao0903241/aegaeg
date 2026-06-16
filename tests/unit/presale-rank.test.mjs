import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveDisplayPresaleRank prefers API rank and falls back to personal volume', async () => {
  const { inferPersonalPresaleRank, resolveDisplayPresaleRank } = await loadModule(
    '/src/lib/presale/rank.ts',
  )

  assert.equal(inferPersonalPresaleRank(0), 0)
  assert.equal(inferPersonalPresaleRank(500), 1)
  assert.equal(inferPersonalPresaleRank(2500), 3)
  assert.equal(inferPersonalPresaleRank(15_000), 7)
  assert.equal(inferPersonalPresaleRank(50_000), 10)
  assert.equal(resolveDisplayPresaleRank(0, 2500), 3)
  assert.equal(resolveDisplayPresaleRank(2, 2500), 3)
  assert.equal(resolveDisplayPresaleRank(4, 1000), 4)
})
