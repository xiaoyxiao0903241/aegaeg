import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('formatUtcBlockTime prints UTC clock and suffix', async () => {
  const { formatUtcBlockTime } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatUtcBlockTime(0), '—')
  assert.equal(formatUtcBlockTime(Date.UTC(2026, 6, 16, 0, 0) / 1000), '2026-07-16 00:00 (UTC)')
})
