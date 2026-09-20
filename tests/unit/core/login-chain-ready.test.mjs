import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isLoginChainReady: only known live === expected', async () => {
  const { isLoginChainReady } = await loadModule('/src/core/auth/auth-machine.ts')

  assert.equal(isLoginChainReady(56, 56), true)
  assert.equal(isLoginChainReady(1, 56), false)
  assert.equal(isLoginChainReady(undefined, 56), false)
  assert.equal(isLoginChainReady(null, 56), false)
})
