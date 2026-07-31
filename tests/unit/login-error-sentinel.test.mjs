import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('toLoginErrorSentinel maps classify kinds', async () => {
  const { toLoginErrorSentinel } = await loadModule('/src/web3/auth/login-with-wallet.ts')
  const { LOGIN_ERROR, ACCOUNT_BANNED_SENTINEL } = await loadModule(
    '/src/shared/api/account-banned.ts',
  )
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  assert.equal(
    toLoginErrorSentinel(new ApiError({ code: 403, error: 'BANNED', message: '账号被封' })),
    ACCOUNT_BANNED_SENTINEL,
  )
  assert.equal(toLoginErrorSentinel({ code: 4001 }), LOGIN_ERROR.USER_REJECTED)
  assert.equal(
    toLoginErrorSentinel(new ApiError({ code: 400, error: 'invalid signature', message: 'x' })),
    LOGIN_ERROR.SIGNATURE_REJECTED,
  )
  assert.equal(toLoginErrorSentinel(new Error('network')), null)
})
