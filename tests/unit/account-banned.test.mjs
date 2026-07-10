import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('isAccountBannedError matches ApiError code 403', async () => {
  const { isAccountBannedError } = await loadModule('/src/shared/api/account-banned.ts')
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  assert.equal(
    isAccountBannedError(new ApiError({ code: 403, error: 'FORBIDDEN', message: '账号被封' })),
    true,
  )
  assert.equal(
    isAccountBannedError(new ApiError({ code: 401, error: 'UNAUTHORIZED', message: 'bad token' })),
    false,
  )
  assert.equal(isAccountBannedError(new Error('账号被封')), false)
})

test('interceptApiError reports banned 403', async () => {
  const {
    interceptApiError,
    resetAccountBannedReportCooldownForTests,
    subscribeAccountBanned,
  } = await loadModule('/src/shared/api/account-banned.ts')
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
  const {
    interceptApiError,
    resetAccountBannedReportCooldownForTests,
    subscribeAccountBanned,
  } = await loadModule('/src/shared/api/account-banned.ts')
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

test('resolveAuthLoginErrorMessage maps sentinels and never returns raw copy', async () => {
  const { ACCOUNT_BANNED_SENTINEL, LOGIN_ERROR, resolveAuthLoginErrorMessage } = await loadModule(
    '/src/shared/api/account-banned.ts',
  )

  const messages = {
    accountBanned: 'Account suspended',
    walletNotConnected: 'Connect wallet',
    loginFailed: 'Login failed',
    loginSignatureRejected: 'Bad signature',
  }

  assert.equal(
    resolveAuthLoginErrorMessage(ACCOUNT_BANNED_SENTINEL, messages),
    'Account suspended',
  )
  assert.equal(
    resolveAuthLoginErrorMessage(LOGIN_ERROR.WALLET_NOT_CONNECTED, messages),
    'Connect wallet',
  )
  assert.equal(resolveAuthLoginErrorMessage(LOGIN_ERROR.USER_REJECTED, messages), null)
  assert.equal(
    resolveAuthLoginErrorMessage(LOGIN_ERROR.SIGNATURE_REJECTED, messages),
    'Bad signature',
  )
  assert.equal(resolveAuthLoginErrorMessage('raw english leak', messages), 'Login failed')
  assert.equal(resolveAuthLoginErrorMessage(null, messages), null)
})

test('resolveReferralBindError maps parent-not-bound sentinel before contract revert', async () => {
  const { REFERRAL_BIND_ERROR, resolveReferralBindError } = await loadModule(
    '/src/views/dapp/web3/resolve-contract-error-message.ts',
  )

  const messages = {
    alreadyBound: 'Already bound',
    parentNotBound: 'Parent not bound',
    selfReferral: 'Self referral',
    invalidParent: 'Invalid parent',
    migratedAccount: 'Migrated',
    systemConfig: 'Config',
    failed: 'Failed',
  }

  assert.equal(
    resolveReferralBindError(REFERRAL_BIND_ERROR.INVALID_PARENT, messages),
    'Invalid parent',
  )
  assert.equal(
    resolveReferralBindError(REFERRAL_BIND_ERROR.PARENT_NOT_BOUND, messages),
    'Parent not bound',
  )
})
