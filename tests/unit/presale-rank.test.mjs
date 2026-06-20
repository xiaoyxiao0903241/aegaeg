import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveDisplayPresaleRank normalizes API presale_rank only', async () => {
  const { resolveDisplayPresaleRank } = await loadModule('/src/lib/presale/rank.ts')

  assert.equal(resolveDisplayPresaleRank(0), 0)
  assert.equal(resolveDisplayPresaleRank(2), 2)
  assert.equal(resolveDisplayPresaleRank(4), 4)
  assert.equal(resolveDisplayPresaleRank(11), 10)
})
