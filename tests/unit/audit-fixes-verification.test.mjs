import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

async function assertMissing(path) {
  await assert.rejects(() => access(path), /ENOENT/)
}

test('audit #16: legacy V2 swap quote modules removed', async () => {
  await assertMissing('src/lib/swap/quote-swap-out.ts')
  await assertMissing('src/lib/swap/build-swap-paths.ts')
  await assertMissing('src/lib/swap/select-best-path.ts')
  await assertMissing('src/config/community-stats.ts')
})

test('audit #11: JWT without exp schedules renewAt from savedAt + fallback TTL', async () => {
  const { deriveAuthAction, FALLBACK_SESSION_TTL_MS } = await loadModule(
    '/src/core/auth/auth-machine.ts',
  )
  const renewThresholdMs = 60_000
  const savedAt = 1_000_000_000
  const action = deriveAuthAction({
    state: {
      kind: 'sessionReady',
      session: { token: 't', address: '0x1', savedAt },
    },
    isLoggingIn: false,
    loginError: null,
    lastAttemptKey: null,
    attemptKey: 'k1',
    renewThresholdMs,
  })

  assert.deepEqual(action, {
    type: 'renewAt',
    at: savedAt + FALLBACK_SESSION_TTL_MS - renewThresholdMs,
  })
})

test('audit #18: transient login errors allow retry; permanent errors block', async () => {
  const { deriveAuthAction, isPermanentLoginErrorMessage } = await loadModule(
    '/src/core/auth/auth-machine.ts',
  )
  const base = {
    isLoggingIn: false,
    lastAttemptKey: null,
    attemptKey: 'k1',
    renewThresholdMs: 60_000,
    state: { kind: 'needsLogin' },
  }

  assert.equal(isPermanentLoginErrorMessage('User rejected'), true)
  assert.equal(isPermanentLoginErrorMessage('LOGIN_FAILED'), true)
  assert.equal(isPermanentLoginErrorMessage('LOGIN_SIGNATURE_REJECTED'), true)
  assert.equal(isPermanentLoginErrorMessage('Network request failed'), false)

  assert.deepEqual(deriveAuthAction({ ...base, loginError: 'User rejected' }), { type: 'idle' })
  assert.deepEqual(deriveAuthAction({ ...base, loginError: 'Network request failed' }), {
    type: 'login',
  })
})

test('audit #12: formatExchangeRateColon uses bigint ratio without Number()', async () => {
  const { formatExchangeRateColon } = await loadModule('/src/views/dapp/exchange/shared.ts')

  assert.equal(
    formatExchangeRateColon({
      amountIn: 10n ** 18n,
      amountOut: 1001n * 10n ** 15n,
      decimalsIn: 18,
      decimalsOut: 18,
    }),
    '1 : 1.001',
  )
})
