import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('confirmClaimWithRetry succeeds after transient failures', async () => {
  const { confirmClaimWithRetry } = await loadModule('/src/web3/reward-claim.ts')
  const { ApiError } = await loadModule('/src/shared/api/client.ts')

  let calls = 0
  let unauthorized = 0
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => {
    calls += 1
    if (calls < 3) {
      return Response.json({ code: 500, error: 'busy', message: 'busy' }, { status: 500 })
    }
    return Response.json({
      code: 0,
      data: { order: { amount: '1.5' } },
    })
  }

  try {
    const result = await confirmClaimWithRetry(
      'jwt',
      { salt: '0x1', txHash: '0xabc' },
      () => {
        unauthorized += 1
      },
      { attempts: 3, delayMs: 1 },
    )
    assert.equal(calls, 3)
    assert.equal(unauthorized, 0)
    assert.equal(result.order?.amount, '1.5')
  } finally {
    globalThis.fetch = originalFetch
  }

  // 401 触发 onUnauthorized
  calls = 0
  globalThis.fetch = async () => {
    calls += 1
    return Response.json(
      { code: 401, error: 'UNAUTHORIZED', message: 'expired' },
      { status: 401 },
    )
  }
  try {
    await assert.rejects(
      () =>
        confirmClaimWithRetry(
          'jwt',
          { salt: '0x1', txHash: '0xabc' },
          () => {
            unauthorized += 1
          },
          { attempts: 2, delayMs: 1 },
        ),
      (error) => error instanceof ApiError && error.code === 401,
    )
    assert.ok(unauthorized >= 1)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('evaluateGenesisPostApproveGate blocks unbound / paused', async () => {
  const { evaluateGenesisPostApproveGate } = await loadModule(
    '/src/core/presale/presale-math.ts',
  )

  assert.deepEqual(
    evaluateGenesisPostApproveGate({
      isBound: true,
      isPaused: false,
      isPausedUnknown: false,
    }),
    { ok: true },
  )
  assert.equal(
    evaluateGenesisPostApproveGate({
      isBound: undefined,
      isPaused: false,
      isPausedUnknown: false,
    }).ok,
    false,
  )
  assert.equal(
    evaluateGenesisPostApproveGate({
      isBound: true,
      isPaused: true,
      isPausedUnknown: false,
    }).reason,
    'unavailable',
  )
})
