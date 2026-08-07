import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isAccountBannedError requires 403 plus ban signal', async () => {
  const { isAccountBannedError } = await loadModule('/src/shared/api/account-banned.ts')
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  assert.equal(
    isAccountBannedError(new ApiError({ code: 403, error: 'FORBIDDEN', message: '账号被封' })),
    true,
  )
  assert.equal(
    isAccountBannedError(new ApiError({ code: 403, error: 'FORBIDDEN', message: 'no access' })),
    false,
  )
  assert.equal(
    isAccountBannedError(new ApiError({ code: 401, error: 'UNAUTHORIZED', message: 'bad token' })),
    false,
  )
  assert.equal(isAccountBannedError(new Error('账号被封')), false)
})

test('interceptApiError reports banned 403', async () => {
  const { interceptApiError, resetAccountBannedReportCooldownForTests, subscribeAccountBanned } =
    await loadModule('/src/shared/api/account-banned.ts')
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  resetAccountBannedReportCooldownForTests()

  let reported = 0
  const unsubscribe = subscribeAccountBanned(() => {
    reported += 1
  })

  try {
    interceptApiError(new ApiError({ code: 401, error: 'UNAUTHORIZED', message: 'nope' }))
    assert.equal(reported, 0)
    interceptApiError(new ApiError({ code: 403, error: 'FORBIDDEN', message: '账号被封' }))
    assert.equal(reported, 1)
  } finally {
    unsubscribe()
  }
})

test('reportAccountBanned throttles duplicate reports within cooldown', async () => {
  const { interceptApiError, resetAccountBannedReportCooldownForTests, subscribeAccountBanned } =
    await loadModule('/src/shared/api/account-banned.ts')
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  resetAccountBannedReportCooldownForTests()

  let reported = 0
  const unsubscribe = subscribeAccountBanned(() => {
    reported += 1
  })

  const banned = new ApiError({ code: 403, error: 'FORBIDDEN', message: '账号被封' })

  try {
    interceptApiError(banned)
    interceptApiError(banned)
    assert.equal(reported, 1)
  } finally {
    unsubscribe()
  }
})

test('authLoginErrorMessage maps sentinels and never returns raw copy', async () => {
  const { ACCOUNT_BANNED_SENTINEL, LOGIN_ERROR, authLoginErrorMessage } = await loadModule(
    '/src/shared/api/account-banned.ts',
  )

  const messages = {
    accountBanned: 'Account suspended',
    walletNotConnected: 'Connect wallet',
    loginFailed: 'Login failed',
    loginSignatureRejected: 'Bad signature',
    loginWrongNetwork: 'Switch to BSC',
  }

  assert.equal(authLoginErrorMessage(ACCOUNT_BANNED_SENTINEL, messages), 'Account suspended')
  assert.equal(authLoginErrorMessage(LOGIN_ERROR.WALLET_NOT_CONNECTED, messages), 'Connect wallet')
  assert.equal(authLoginErrorMessage(LOGIN_ERROR.USER_REJECTED, messages), null)
  assert.equal(authLoginErrorMessage(LOGIN_ERROR.SIGNATURE_REJECTED, messages), 'Bad signature')
  assert.equal(authLoginErrorMessage(LOGIN_ERROR.WRONG_NETWORK, messages), 'Switch to BSC')
  assert.equal(authLoginErrorMessage('raw english leak', messages), 'Login failed')
  assert.equal(authLoginErrorMessage(null, messages), null)
})

test('getErrorMessage maps referral soft-block sentinels', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { REFERRAL_BIND_ERROR } = await loadModule('/src/web3/errors/sentinels.ts')

  assert.equal(
    getErrorMessage(REFERRAL_BIND_ERROR.INVALID_PARENT, t),
    t.community.bindErrors.invalidParent,
  )
  assert.equal(
    getErrorMessage(REFERRAL_BIND_ERROR.PARENT_NOT_BOUND, t),
    t.community.bindErrors.parentNotBound,
  )
})
