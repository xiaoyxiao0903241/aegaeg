import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getErrorMessage maps flash soft gates and Usd1Swap reverts', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { FLASH_USD1_GATE_ERROR } = await loadModule('/src/web3/errors/sentinels.ts')

  assert.equal(getErrorMessage(FLASH_USD1_GATE_ERROR.paused, t), t.exchange.flash.gates.paused)
  assert.equal(
    getErrorMessage(FLASH_USD1_GATE_ERROR.insufficientReserve, t),
    t.exchange.flash.gates.insufficientReserve,
  )

  const cases = [
    ['ErrorPaused', t.exchange.flash.gates.paused],
    ['ErrorInsufficientUsd1', t.exchange.flash.gates.insufficientReserve],
    ['ErrorBelowMin', t.exchange.flash.gates.belowMin],
    ['ErrorAboveMax', t.exchange.flash.gates.aboveMax],
    ['ErrorInsufficientOutput', t.exchange.flash.gates.insufficientOutput],
    ['ErrorTransferAmountMismatch', t.exchange.flash.gates.transferMismatch],
    ['ErrorZeroAddress', t.exchange.flash.gates.zeroAddress],
    ['ErrorSameToken', t.exchange.flash.gates.sameToken],
    ['ErrorZeroAmount', t.staking.gates.zeroAmount], // §19 shared zero-amount tip
    ['ErrorZeroRate', t.exchange.flash.gates.zeroRate],
    ['ErrorCallerNotAuthorized', t.exchange.flash.gates.notAuthorized],
    ['ErrorNotAuthorized', t.exchange.flash.gates.notAuthorized],
    ['ErrorInvalidLimits', t.exchange.flash.gates.invalidLimits],
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
