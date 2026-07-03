import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('isAccountBannedError matches ApiError code 403', async () => {
  const { isAccountBannedError } = await loadModule('/src/lib/api/account-banned.ts')
  const { ApiError } = await loadModule('/src/lib/api/client.ts')

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
  const { interceptApiError, subscribeAccountBanned } = await loadModule(
    '/src/lib/api/account-banned.ts',
  )
  const { ApiError } = await loadModule('/src/lib/api/client.ts')

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

test('resolveAuthLoginErrorMessage maps banned sentinel to i18n', async () => {
  const { ACCOUNT_BANNED_SENTINEL, resolveAuthLoginErrorMessage } = await loadModule(
    '/src/lib/api/account-banned.ts',
  )

  assert.equal(
    resolveAuthLoginErrorMessage(ACCOUNT_BANNED_SENTINEL, 'Account suspended'),
    'Account suspended',
  )
  assert.equal(resolveAuthLoginErrorMessage('other', 'Account suspended'), 'other')
  assert.equal(resolveAuthLoginErrorMessage(null, 'Account suspended'), null)
})

test('resolveReferralBindError maps parent-not-bound sentinel before contract revert', async () => {
  const { REFERRAL_BIND_ERROR, resolveReferralBindError } = await loadModule(
    '/src/lib/web3/resolve-contract-error-message.ts',
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
    resolveReferralBindError(REFERRAL_BIND_ERROR.PARENT_NOT_BOUND, messages),
    'Parent not bound',
  )
})
