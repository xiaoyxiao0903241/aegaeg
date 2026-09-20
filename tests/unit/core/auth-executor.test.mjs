import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('401 reports unauthorized once; 403 banned stays separate', async () => {
  const {
    interceptApiError,
    resetAccountBannedReportCooldownForTests,
    subscribeAccountBanned,
    subscribeUnauthorized,
  } = await loadModule('/src/shared/api/account-banned.ts')
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  resetAccountBannedReportCooldownForTests()

  let unauthorized = 0
  let banned = 0
  const unsubUnauthorized = subscribeUnauthorized(() => {
    unauthorized += 1
  })
  const unsubBanned = subscribeAccountBanned(() => {
    banned += 1
  })

  try {
    interceptApiError(new ApiError({ code: 401, error: 'UNAUTHORIZED', message: 'expired' }))
    interceptApiError(new ApiError({ code: 401, error: 'UNAUTHORIZED', message: 'expired' }))
    assert.equal(unauthorized, 1)
    assert.equal(banned, 0)

    interceptApiError(new ApiError({ code: 403, error: 'FORBIDDEN', message: '账号被封' }))
    assert.equal(banned, 1)
    assert.equal(unauthorized, 1)
  } finally {
    unsubUnauthorized()
    unsubBanned()
  }
})
