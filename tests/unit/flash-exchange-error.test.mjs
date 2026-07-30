import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const MESSAGES = {
  paused: 'paused',
  belowMin: 'belowMin',
  aboveMax: 'aboveMax',
  insufficientReserve: 'insufficientReserve',
  zeroRate: 'zeroRate',
  insufficientOutput: 'insufficientOutput',
  transferMismatch: 'transferMismatch',
  zeroAddress: 'zeroAddress',
  sameToken: 'sameToken',
  zeroAmount: 'zeroAmount',
  notAuthorized: 'notAuthorized',
  invalidLimits: 'invalidLimits',
}

test('resolveFlashExchangeError maps handbook Usd1Swap + gAGX errors', async () => {
  const { resolveFlashExchangeError } = await loadModule('/src/web3/errors/flash-exchange-error.ts')
  const { FLASH_USD1_GATE_ERROR } = await loadModule('/src/web3/errors/sentinels.ts')

  assert.equal(
    resolveFlashExchangeError(new Error(FLASH_USD1_GATE_ERROR.paused), MESSAGES),
    'paused',
  )
  assert.equal(
    resolveFlashExchangeError(new Error(FLASH_USD1_GATE_ERROR.insufficientReserve), MESSAGES),
    'insufficientReserve',
  )

  const cases = [
    ['ErrorPaused', 'paused'],
    ['ErrorInsufficientUsd1', 'insufficientReserve'],
    ['ErrorBelowMin', 'belowMin'],
    ['ErrorAboveMax', 'aboveMax'],
    ['ErrorInsufficientOutput', 'insufficientOutput'],
    ['ErrorTransferAmountMismatch', 'transferMismatch'],
    ['ErrorZeroAddress', 'zeroAddress'],
    ['ErrorSameToken', 'sameToken'],
    ['ErrorZeroAmount', 'zeroAmount'],
    ['ErrorZeroRate', 'zeroRate'],
    ['ErrorCallerNotAuthorized', 'notAuthorized'],
    ['ErrorNotAuthorized', 'notAuthorized'],
    ['ErrorInvalidLimits', 'invalidLimits'],
  ]

  for (const [name, key] of cases) {
    assert.equal(resolveFlashExchangeError(new Error(name), MESSAGES), key, name)
  }

  assert.equal(resolveFlashExchangeError(new Error('UnknownBoom'), MESSAGES), null)
})

test('USD1_SWAP_ERRORS lists all handbook custom errors', async () => {
  const { USD1_SWAP_ERRORS, REDEEMABLE_GAGX_ERRORS } = await loadModule('/src/web3/abis.ts')
  for (const name of [
    'ErrorPaused',
    'ErrorInsufficientUsd1',
    'ErrorBelowMin',
    'ErrorAboveMax',
    'ErrorInsufficientOutput',
    'ErrorTransferAmountMismatch',
    'ErrorZeroAddress',
    'ErrorSameToken',
    'ErrorZeroAmount',
    'ErrorZeroRate',
    'ErrorCallerNotAuthorized',
    'ErrorInvalidLimits',
  ]) {
    assert.ok(
      USD1_SWAP_ERRORS.some((entry) => entry.includes(name)),
      `missing ${name}`,
    )
  }
  assert.ok(REDEEMABLE_GAGX_ERRORS.some((e) => e.includes('ErrorZeroAmount')))
  assert.ok(REDEEMABLE_GAGX_ERRORS.some((e) => e.includes('ErrorNotAuthorized')))
})
