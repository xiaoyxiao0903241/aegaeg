import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('parseTokenAmount converts decimal input to wei', async () => {
  const { parseTokenAmount } = await loadModule('/src/lib/swap/token-amount.ts')

  assert.equal(parseTokenAmount('1', 18), 10n ** 18n)
  assert.equal(parseTokenAmount('200.5', 18), 2005n * 10n ** 17n)
  assert.equal(parseTokenAmount('100.', 18), 100n * 10n ** 18n)
  assert.equal(parseTokenAmount('', 18), 0n)
  assert.equal(parseTokenAmount('abc', 18), 0n)
})

test('sanitizeTokenAmountInput keeps numeric format and decimal typing state', async () => {
  const { sanitizeTokenAmountInput } = await loadModule('/src/lib/swap/token-amount.ts')

  assert.equal(sanitizeTokenAmountInput('100.', 6), '100.')
  assert.equal(sanitizeTokenAmountInput('100.5abc', 6), '100.5')
  assert.equal(sanitizeTokenAmountInput('1.2345678', 6), '1.234567')
  assert.equal(sanitizeTokenAmountInput('1.0000000', 6), '1.000000')
  assert.equal(sanitizeTokenAmountInput('01.20', 6), '1.20')
  assert.equal(sanitizeTokenAmountInput('.', 6), '0.')
  assert.equal(sanitizeTokenAmountInput('', 6), '')
})

test('formatTokenAmount renders human readable balance', async () => {
  const { formatTokenAmount } = await loadModule('/src/lib/swap/token-amount.ts')

  assert.equal(formatTokenAmount(10n ** 18n, 18), '1')
  assert.equal(formatTokenAmount(1234567890000000000n, 18, 4), '1.2345')
})

test('slippagePercentToBps converts UI percent to basis points', async () => {
  const { slippagePercentToBps } = await loadModule('/src/lib/swap/token-amount.ts')

  assert.equal(slippagePercentToBps(0.5), 50)
  assert.equal(slippagePercentToBps(1), 100)
})

test('capTokenAmountInput clamps sell input to wallet balance', async () => {
  const { capTokenAmountInput } = await loadModule('/src/lib/swap/token-amount.ts')
  const balance = 5n * 10n ** 18n

  assert.equal(capTokenAmountInput('3', balance, 18), '3')
  assert.equal(capTokenAmountInput('100.', balance, 18), '5')
  assert.equal(capTokenAmountInput('6', balance, 18), '5')
  assert.equal(capTokenAmountInput('5.5', balance, 18), '5')
  assert.equal(capTokenAmountInput('1', 0n, 18), '')
})
