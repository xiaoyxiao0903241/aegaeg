import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('parseRequiredAddress throws when missing (no fallback)', async () => {
  const { parseRequiredAddress } = await loadModule('/src/shared/config/env.ts')
  assert.throws(() => parseRequiredAddress('VITE_BSC_WBNB', ''), /Missing required env/)
  assert.throws(() => parseRequiredAddress('VITE_BSC_WBNB', undefined), /Missing required env/)
})

test('parseRequiredAddress throws on invalid address', async () => {
  const { parseRequiredAddress } = await loadModule('/src/shared/config/env.ts')
  assert.throws(() => parseRequiredAddress('VITE_BSC_WBNB', 'not-an-address'), /Invalid/)
})

test('parseRequiredAddress accepts valid address', async () => {
  const { parseRequiredAddress } = await loadModule('/src/shared/config/env.ts')
  const value = parseRequiredAddress('VITE_BSC_WBNB', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
  assert.equal(value, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
})

test('parseRequiredString / number / boolean are fail-closed', async () => {
  const { parseRequiredString, parseRequiredNumber, parseRequiredBoolean } = await loadModule(
    '/src/shared/config/env.ts',
  )

  assert.throws(() => parseRequiredString('VITE_X', ''), /Missing/)
  assert.equal(parseRequiredNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS', '50'), 50)
  assert.throws(() => parseRequiredNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS', 'nope'), /Invalid/)
  assert.equal(parseRequiredBoolean('VITE_API_DERIVE_FROM_DOMAIN', 'true'), true)
  assert.equal(parseRequiredBoolean('VITE_API_DERIVE_FROM_DOMAIN', '0'), false)
  assert.throws(() => parseRequiredBoolean('VITE_API_DERIVE_FROM_DOMAIN', 'maybe'), /Invalid/)
})

test('parseDebugMode is off when missing, empty, or not true/1', async () => {
  const { parseDebugMode } = await loadModule('/src/shared/config/env.ts')
  assert.equal(parseDebugMode(undefined), false)
  assert.equal(parseDebugMode(''), false)
  assert.equal(parseDebugMode('  '), false)
  assert.equal(parseDebugMode('false'), false)
  assert.equal(parseDebugMode('0'), false)
  assert.equal(parseDebugMode('maybe'), false)
})

test('parseDebugMode is on only for true or 1', async () => {
  const { parseDebugMode } = await loadModule('/src/shared/config/env.ts')
  assert.equal(parseDebugMode('true'), true)
  assert.equal(parseDebugMode('1'), true)
  assert.equal(parseDebugMode(' true '), true)
})
