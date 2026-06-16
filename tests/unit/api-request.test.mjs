import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildApiUrl appends query params', async () => {
  const { buildApiUrl } = await loadModule('/src/lib/api/request.ts')

  assert.equal(
    buildApiUrl('/sales/logs', { page: 2, page_size: 10 }),
    'https://api.xdpro.cc/api/sales/logs?page=2&page_size=10',
  )
})

test('apiRequest attaches bearer token and parses envelope', async () => {
  const { apiRequest } = await loadModule('/src/lib/api/request.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/performance$/)
    assert.equal(init?.headers?.Authorization, 'Bearer secret')

    return Response.json({
      code: 0,
      data: { address: '0x1', presale_rank: 0 },
    })
  }

  try {
    const data = await apiRequest('/performance', { token: 'secret' })
    assert.equal(data.address, '0x1')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('apiRequest throws ApiError for business failures', async () => {
  const { apiRequest, ApiError } = await loadModule('/src/lib/api/request.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      code: 401,
      error: 'UNAUTHORIZED',
      message: 'bad token',
    })

  try {
    await assert.rejects(
      () => apiRequest('/performance', { token: 'bad' }),
      (error) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.code, 401)
        return true
      },
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getTeamRewardClaimLogs calls paginated endpoint', async () => {
  const { getTeamRewardClaimLogs } = await loadModule('/src/lib/api/endpoints.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/team-reward\/logs\?page=1&page_size=5/)
    assert.equal(init?.headers?.Authorization, 'Bearer jwt')

    return Response.json({
      code: 0,
      data: { total: 0, page: 1, page_size: 5, items: [] },
    })
  }

  try {
    const data = await getTeamRewardClaimLogs('jwt', { page: 1, page_size: 5 })
    assert.deepEqual(data.items, [])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getTeamReferrals calls paginated endpoint', async () => {
  const { getTeamReferrals } = await loadModule('/src/lib/api/endpoints.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/team\/referrals\?page=1&page_size=5/)
    assert.equal(init?.headers?.Authorization, 'Bearer jwt')

    return Response.json({
      code: 0,
      data: { total: 0, page: 1, page_size: 5, items: [] },
    })
  }

  try {
    const data = await getTeamReferrals('jwt', { page: 1, page_size: 5 })
    assert.deepEqual(data.items, [])
  } finally {
    globalThis.fetch = originalFetch
  }
})
