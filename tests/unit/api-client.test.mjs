import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('createApiClient builds absolute URLs from base path', async () => {
  const { createApiClient } = await loadModule('/src/lib/api/client.ts')
  const client = createApiClient({ baseUrl: 'https://api.xdpro.cc/api' })

  assert.equal(client.buildUrl('/auth/login'), 'https://api.xdpro.cc/api/auth/login')
  assert.equal(
    client.buildUrl('sales/logs?page=2'),
    'https://api.xdpro.cc/api/sales/logs?page=2',
  )
})

test('parseApiResponse returns data when code is zero', async () => {
  const { parseApiResponse } = await loadModule('/src/lib/api/client.ts')

  assert.deepEqual(parseApiResponse({ code: 0, data: { token: 'jwt' } }), {
    token: 'jwt',
  })
})

test('parseApiResponse throws ApiError for business failures', async () => {
  const { parseApiResponse, ApiError } = await loadModule('/src/lib/api/client.ts')

  assert.throws(
    () => parseApiResponse({ code: 401, error: 'UNAUTHORIZED', message: 'bad token' }),
    (error) => {
      assert.ok(error instanceof ApiError)
      assert.equal(error.code, 401)
      assert.equal(error.error, 'UNAUTHORIZED')
      return true
    },
  )
})

test('createAuthHeader prefixes bearer token', async () => {
  const { createAuthHeader } = await loadModule('/src/lib/api/client.ts')

  assert.deepEqual(createAuthHeader('abc'), {
    Authorization: 'Bearer abc',
  })
})
