import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

async function assertMissing(path) {
  await assert.rejects(() => access(path), /ENOENT/)
}

test('audit #16: legacy V2 swap quote modules removed', async () => {
  await assertMissing('src/lib/swap/quote-swap-out.ts')
  await assertMissing('src/lib/swap/build-swap-paths.ts')
  await assertMissing('src/lib/swap/select-best-path.ts')
  await assertMissing('src/config/community-stats.ts')
})

test('audit #11: JWT without exp uses fallback TTL for local expiry, not renew', async () => {
  const { FALLBACK_SESSION_TTL_MS, deriveAuthAction } = await loadModule(
    '/src/core/auth/auth-machine.ts',
  )

  assert.equal(FALLBACK_SESSION_TTL_MS, 60 * 60 * 1000)
  assert.equal(deriveAuthAction, undefined)
})

test('audit #18: needsSignIn is derived only; login API is never scheduled', async () => {
  const { deriveAuthState } = await loadModule('/src/core/auth/auth-machine.ts')

  assert.deepEqual(deriveAuthState({ walletAddress: '0xabc', sessionsByAddress: {} }), {
    kind: 'needsSignIn',
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
