import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('parseTokenAmount converts decimal input to wei', async () => {
  const { parseTokenAmount } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(parseTokenAmount('1', 18), 10n ** 18n)
  assert.equal(parseTokenAmount('200.5', 18), 2005n * 10n ** 17n)
  assert.equal(parseTokenAmount('100.', 18), 100n * 10n ** 18n)
  assert.equal(parseTokenAmount('', 18), 0n)
  assert.equal(parseTokenAmount('1,234.5', 18), 12345n * 10n ** 17n)
  assert.equal(parseTokenAmount('abc', 18), 0n)
})

test('formatTokenAmountInputDisplay adds thousand separators while preserving decimals', async () => {
  const { formatTokenAmountInputDisplay } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(formatTokenAmountInputDisplay(''), '')
  assert.equal(formatTokenAmountInputDisplay('100.'), '100.')
  assert.equal(formatTokenAmountInputDisplay('1234.56'), '1,234.56')
  assert.equal(formatTokenAmountInputDisplay('1000000'), '1,000,000')
  assert.equal(formatTokenAmountInputDisplay('0.5'), '0.5')
})

test('sanitizeTokenAmountInput strips grouping separators', async () => {
  const { sanitizeTokenAmountInput } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(sanitizeTokenAmountInput('1,234.5abc', 6), '1234.5')
  assert.equal(sanitizeTokenAmountInput('100.', 6), '100.')
  assert.equal(sanitizeTokenAmountInput('1.2345678', 6), '1.234567')
  assert.equal(sanitizeTokenAmountInput('1.0000000', 6), '1.000000')
  assert.equal(sanitizeTokenAmountInput('01.20', 6), '1.20')
  assert.equal(sanitizeTokenAmountInput('.', 6), '0.')
  assert.equal(sanitizeTokenAmountInput('', 6), '')
})

test('formatTokenAmount renders human readable balance', async () => {
  const { formatTokenAmount, parseTokenAmount } = await loadModule(
    '/src/core/exchange/token-amount.ts',
  )

  assert.equal(formatTokenAmount(10n ** 18n, 18), '1')
  assert.equal(formatTokenAmount(1234567890000000000n, 18, 4), '1.2345')

  // 100% fill path: full decimals must round-trip to exact balance (no dust).
  const dusty = 1234567890123456789n
  const full = formatTokenAmount(dusty, 18, 18)
  assert.equal(parseTokenAmount(full, 18), dusty)
  assert.notEqual(parseTokenAmount(formatTokenAmount(dusty, 18, 6), 18), dusty)
})

test('formatTokenAmount fixed digits pads trailing zeros', async () => {
  const { formatTokenAmount, parseTokenAmount } = await loadModule(
    '/src/core/exchange/token-amount.ts',
  )

  assert.equal(formatTokenAmount(0n, 18, { digits: 2, trimZeros: false }), '0.00')
  assert.equal(
    formatTokenAmount(parseTokenAmount('6.5', 18), 18, { digits: 2, trimZeros: false }),
    '6.50',
  )
  assert.equal(
    formatTokenAmount(parseTokenAmount('39', 18), 18, { digits: 2, trimZeros: false }),
    '39.00',
  )
  assert.equal(
    formatTokenAmount(parseTokenAmount('1234.567', 18), 18, { digits: 2, trimZeros: false }),
    '1,234.56',
  )
})

test('formatGroupedNumber is the human-number display core', async () => {
  const { formatGroupedNumber } = await loadModule('/src/shared/api/format-display.ts')

  assert.equal(
    formatGroupedNumber(1234.5, { digits: 2, trimZeros: false, prefix: '$' }),
    '$1,234.50',
  )
  assert.equal(formatGroupedNumber(1234.5, { digits: 2, prefix: '$' }), '$1,234.50')
  assert.equal(formatGroupedNumber(1000, { digits: 0, trimZeros: true }), '1,000')
  assert.equal(formatGroupedNumber(42, { digits: 0, trimZeros: true }), '42')
})

test('slippagePercentToBps converts UI percent to basis points', async () => {
  const { slippagePercentToBps } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(slippagePercentToBps(0.5), 50)
  assert.equal(slippagePercentToBps(1), 100)
})

test('capTokenAmountInput clamps sell input to wallet balance', async () => {
  const { capTokenAmountInput } = await loadModule('/src/core/exchange/token-amount.ts')
  const balance = 5n * 10n ** 18n

  assert.equal(capTokenAmountInput('3', balance, 18), '3')
  assert.equal(capTokenAmountInput('100.', balance, 18), '5')
  assert.equal(capTokenAmountInput('6', balance, 18), '5')
  assert.equal(capTokenAmountInput('5.5', balance, 18), '5')
  assert.equal(capTokenAmountInput('1', 0n, 18), '')
})
