import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { loadModule } from '../load-module.mjs'

describe('hideDisabledQueryData', () => {
  it('keeps data while hydrating or while the query is enabled', async () => {
    const { hideDisabledQueryData } = await loadModule(
      '/src/shared/api/query/hide-disabled-query-data.ts',
    )
    const cached = { data: 42, isPlaceholderData: true }

    assert.equal(hideDisabledQueryData(cached, { enabled: false, hasHydrated: false }).data, 42)
    assert.equal(hideDisabledQueryData(cached, { enabled: true, hasHydrated: true }).data, 42)
  })

  it('drops cached and placeholder data after hydrate when disabled', async () => {
    const { hideDisabledQueryData } = await loadModule(
      '/src/shared/api/query/hide-disabled-query-data.ts',
    )
    const cached = { data: 42, isPlaceholderData: true }
    const hidden = hideDisabledQueryData(cached, { enabled: false, hasHydrated: true })

    assert.equal(hidden.data, undefined)
    assert.equal(hidden.isPlaceholderData, false)
  })
})
