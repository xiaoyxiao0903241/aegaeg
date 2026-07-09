import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('readEnvAddress uses fallback when env key is empty', async () => {
  const { readEnvAddress } = await loadModule('/src/shared/config/env.ts')
  const fallback = '0x1111111111111111111111111111111111111111'
  // Unset keys resolve to fallback via import.meta.env (empty in test unless set).
  const value = readEnvAddress('VITE_BSC_WBNB', fallback)
  assert.match(value, /^0x[a-fA-F0-9]{40}$/)
})
