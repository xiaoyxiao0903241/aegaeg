import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('apiUrl keeps absolute https bases', async () => {
  const { resolveApiRequestUrl } = await loadModule('/src/shared/api/request.ts')

  assert.equal(
    resolveApiRequestUrl('https://api.example/api/sales/logs', { page: 2 }),
    'https://api.example/api/sales/logs?page=2',
  )
})

test('apiUrl accepts relative /api path for Vite proxy (no Invalid URL)', async () => {
  const { resolveApiRequestUrl } = await loadModule('/src/shared/api/request.ts')

  assert.equal(
    resolveApiRequestUrl('/api/protocol-market-stats/series', { range: 'all' }),
    '/api/protocol-market-stats/series?range=all',
  )
  assert.equal(resolveApiRequestUrl('/api/auth/login'), '/api/auth/login')
})
