import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('classifyLoginFailure maps reject / signature / ban / transient', async () => {
  const { classifyLoginFailure, shouldClearCachedLoginSignature } = await loadModule(
    '/src/core/auth/classify-login-failure.ts',
  )
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  assert.equal(classifyLoginFailure({ code: 4001 }), 'user_rejected')
  assert.equal(
    classifyLoginFailure(new ApiError({ code: 400, error: 'nonce used', message: 'bad' })),
    'signature_rejected',
  )
  assert.equal(
    classifyLoginFailure(new ApiError({ code: 403, error: 'BANNED', message: '账号被封' })),
    'banned',
  )
  assert.equal(
    classifyLoginFailure(new ApiError({ code: 403, error: 'FORBIDDEN', message: 'nope' })),
    'transient',
  )
  assert.equal(classifyLoginFailure(new Error('network down')), 'transient')
  assert.equal(
    shouldClearCachedLoginSignature(
      new ApiError({ code: 400, error: 'invalid signature', message: 'x' }),
    ),
    true,
  )
  assert.equal(shouldClearCachedLoginSignature(new Error('timeout')), false)
})
