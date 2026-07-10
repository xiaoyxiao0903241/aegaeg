import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildApiUrl appends query params', async () => {
  const { buildApiUrl } = await loadModule('/src/shared/api/request.ts')
  const { getApiBaseUrl } = await loadModule('/src/shared/api/client.ts')

  // Derive the base from the same resolver the app uses so the test stays
  // hermetic — it verifies query-param handling, not the deploy-specific host.
  const base = getApiBaseUrl().replace(/\/$/, '')
  assert.equal(
    buildApiUrl('/sales/logs', { page: 2, page_size: 10 }),
    `${base}/sales/logs?page=2&page_size=10`,
  )
})

test('apiRequest attaches bearer token and parses envelope', async () => {
  const { apiRequest } = await loadModule('/src/shared/api/request.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/performance$/)
    assert.equal(init?.method, 'POST')
    assert.equal(init?.headers?.Authorization, 'Bearer secret')
    assert.deepEqual(JSON.parse(String(init?.body)), {})

    return Response.json({
      code: 0,
      data: { address: '0x1', presale_rank: 0 },
    })
  }

  try {
    const data = await apiRequest('/performance', { method: 'POST', token: 'secret', body: {} })
    assert.equal(data.address, '0x1')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('apiRequest surfaces 403 banned as ApiError', async () => {
  const { apiRequest, ApiError } = await loadModule('/src/shared/api/request.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      code: 403,
      error: 'FORBIDDEN',
      message: '账号被封',
    })

  try {
    await assert.rejects(
      () => apiRequest('/performance', { method: 'POST', token: 'jwt', body: {} }),
      (error) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.code, 403)
        return true
      },
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('apiRequest throws ApiError for business failures', async () => {
  const { apiRequest, ApiError } = await loadModule('/src/shared/api/request.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      code: 401,
      error: 'UNAUTHORIZED',
      message: 'bad token',
    })

  try {
    await assert.rejects(
      () => apiRequest('/performance', { method: 'POST', token: 'bad', body: {} }),
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

test('apiRequest defaults to POST when method is omitted', async () => {
  const { apiRequest } = await loadModule('/src/shared/api/request.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (_url, init) => {
    assert.equal(init?.method, 'POST')
    return Response.json({ code: 0, data: { ok: true } })
  }

  try {
    const data = await apiRequest('/performance', { token: 'secret', body: {} })
    assert.equal(data.ok, true)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('apiRequest non-JSON 403 does not treat bare 403 as banned', async () => {
  const { apiRequest, ApiError } = await loadModule('/src/shared/api/request.ts')
  const {
    resetAccountBannedReportCooldownForTests,
    subscribeAccountBanned,
  } = await loadModule('/src/shared/api/account-banned.ts')

  resetAccountBannedReportCooldownForTests()
  let bannedReports = 0
  const unsubscribe = subscribeAccountBanned(() => {
    bannedReports += 1
  })

  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response('<html>forbidden</html>', {
      status: 403,
      headers: { 'Content-Type': 'text/html' },
    })

  try {
    await assert.rejects(
      () => apiRequest('/performance', { token: 'jwt', body: {} }),
      (error) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.code, 403)
        assert.equal(error.error, 'INVALID_JSON')
        return true
      },
    )
    assert.equal(bannedReports, 0)
  } finally {
    unsubscribe()
    globalThis.fetch = originalFetch
    resetAccountBannedReportCooldownForTests()
  }
})

test('getTeamRewardClaimLogs posts pagination body', async () => {
  const { getTeamRewardClaimLogs } = await loadModule('/src/shared/api/endpoints.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/team-reward\/logs$/)
    assert.equal(init?.method, 'POST')
    assert.equal(init?.headers?.Authorization, 'Bearer jwt')
    assert.deepEqual(JSON.parse(String(init?.body)), { page: 1, page_size: 5 })

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

test('getTeamReferrals posts pagination body', async () => {
  const { getTeamReferrals } = await loadModule('/src/shared/api/endpoints.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/team\/referrals$/)
    assert.equal(init?.method, 'POST')
    assert.equal(init?.headers?.Authorization, 'Bearer jwt')
    assert.deepEqual(JSON.parse(String(init?.body)), { page: 1, page_size: 5 })

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
