import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const messages = {
  network: 'Network',
  timeout: 'Timeout',
  unavailable: 'Unavailable',
  badResponse: 'Bad response',
  fallback: 'Fallback',
}

test('apiUserFacingError maps transport codes and never returns raw message', async () => {
  const { ApiError } = await loadModule('/src/shared/api/client.ts')
  const { API_TRANSPORT_ERROR, apiUserFacingError } = await loadModule(
    '/src/shared/api/api-user-facing-error.ts',
  )

  assert.equal(
    apiUserFacingError(
      new ApiError({ code: 0, error: API_TRANSPORT_ERROR.NETWORK, message: 'Failed to fetch' }),
      messages,
    ),
    'Network',
  )
  assert.equal(
    apiUserFacingError(
      new ApiError({ code: 502, error: API_TRANSPORT_ERROR.UNAVAILABLE, message: 'Bad Gateway' }),
      messages,
    ),
    'Unavailable',
  )
  assert.equal(
    apiUserFacingError(
      new ApiError({ code: 400, error: 'SOME_UNKNOWN_BIZ', message: '账号被封详情泄露' }),
      messages,
    ),
    'Fallback',
  )
  assert.equal(apiUserFacingError(new Error('execution reverted'), messages), null)
})

test('apiRequest wraps network failures as NETWORK ApiError', async () => {
  const { apiRequest, ApiError } = await loadModule('/src/shared/api/request.ts')
  const { API_TRANSPORT_ERROR } = await loadModule('/src/shared/api/api-user-facing-error.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => {
    throw new TypeError('Failed to fetch')
  }

  try {
    await assert.rejects(
      () => apiRequest('/performance', { token: 'jwt', body: {} }),
      (error) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.error, API_TRANSPORT_ERROR.NETWORK)
        return true
      },
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('apiRequest maps 5xx non-JSON to UNAVAILABLE', async () => {
  const { apiRequest, ApiError } = await loadModule('/src/shared/api/request.ts')
  const { API_TRANSPORT_ERROR } = await loadModule('/src/shared/api/api-user-facing-error.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response('<html>down</html>', {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    })

  try {
    await assert.rejects(
      () => apiRequest('/performance', { token: 'jwt', body: {} }),
      (error) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.code, 502)
        assert.equal(error.error, API_TRANSPORT_ERROR.UNAVAILABLE)
        return true
      },
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
