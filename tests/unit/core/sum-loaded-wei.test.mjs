import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { loadModule } from '../load-module.mjs'

describe('sumLoadedWei', () => {
  it('missing list → null; empty list → 0n; rows → sum', async () => {
    const { sumLoadedWei } = await loadModule('/src/core/query/sum-loaded-wei.ts')
    const pick = (row) => row.n

    assert.equal(sumLoadedWei(undefined, pick), null)
    assert.equal(sumLoadedWei(null, pick), null)
    assert.equal(sumLoadedWei([], pick), 0n)
    assert.equal(sumLoadedWei([{ n: 1n }, { n: 2n }], pick), 3n)
  })
})

describe('sumOptionalWei', () => {
  it('any missing part → null; all present → sum including true zero', async () => {
    const { sumOptionalWei } = await loadModule('/src/core/query/sum-loaded-wei.ts')

    assert.equal(sumOptionalWei([undefined, 1n]), null)
    assert.equal(sumOptionalWei([1n, null]), null)
    assert.equal(sumOptionalWei([]), 0n)
    assert.equal(sumOptionalWei([0n, 0n, 0n]), 0n)
    assert.equal(sumOptionalWei([1n, 2n, 3n]), 6n)
  })
})
