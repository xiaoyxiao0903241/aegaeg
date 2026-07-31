import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('displayPresaleRank normalizes API presale_rank only', async () => {
  const { displayPresaleRank } = await loadModule('/src/core/presale/rank.ts')

  assert.equal(displayPresaleRank(0), 0)
  assert.equal(displayPresaleRank(2), 2)
  assert.equal(displayPresaleRank(4), 4)
  assert.equal(displayPresaleRank(11), 10)
})
