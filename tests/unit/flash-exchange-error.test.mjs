import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getErrorMessage maps flash soft blocks and Usd1Swap reverts', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { FLASH_USD1_BLOCKED } = await loadModule('/src/web3/errors/sentinels.ts')

  assert.equal(getErrorMessage(FLASH_USD1_BLOCKED.paused, t), t.exchange.flash.blocked.paused)
  assert.equal(
    getErrorMessage(FLASH_USD1_BLOCKED.insufficientReserve, t),
    t.exchange.flash.blocked.insufficientReserve,
  )

  const cases = [
    // Shared Error* names collide with burn — map to chain.reverts, not flash-only copy.
    ['ErrorPaused', t.errors.chain.reverts.operationPaused],
    ['ErrorInsufficientUsd1', t.exchange.flash.blocked.insufficientReserve],
    ['ErrorBelowMin', t.errors.chain.reverts.belowMinAmount],
    ['ErrorAboveMax', t.errors.chain.reverts.aboveMaxAmount],
    ['ErrorInsufficientOutput', t.exchange.flash.blocked.insufficientOutput],
    ['ErrorTransferAmountMismatch', t.exchange.flash.blocked.transferMismatch],
    ['ErrorZeroAddress', t.exchange.flash.blocked.zeroAddress],
    ['ErrorSameToken', t.exchange.flash.blocked.sameToken],
    ['ErrorZeroAmount', t.errors.chain.reverts.zeroAmount], // §19 shared zero-amount tip
    ['ErrorZeroRate', t.errors.chain.reverts.zeroRate],
    ['ErrorCallerNotAuthorized', t.exchange.flash.blocked.notAuthorized],
    ['ErrorNotAuthorized', t.exchange.flash.blocked.notAuthorized],
    ['ErrorInvalidLimits', t.exchange.flash.blocked.invalidLimits],
  ]

  for (const [name, expected] of cases) {
    assert.equal(getErrorMessage(new Error(name), t), expected, name)
  }

  assert.equal(getErrorMessage(new Error('UnknownBoom'), t), t.errors.chain.fallback)
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
