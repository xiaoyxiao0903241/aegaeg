import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

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

test('formatTokenAmountDraft is ungrouped and strips trailing zeros', async () => {
  const { formatTokenAmountDraft, parseTokenAmount, formatTokenAmount } = await loadModule(
    '/src/core/exchange/token-amount.ts',
  )

  const dusty = 179067524420000n // 10 decimals → 17906.752442
  assert.equal(formatTokenAmount(dusty, 10, { digits: 10, trimZeros: false }), '17,906.7524420000')
  const draft = formatTokenAmountDraft(dusty, 10, 10)
  assert.equal(draft, '17906.752442')
  assert.equal(parseTokenAmount(draft, 10), dusty)

  const full = 1234567890123456789n
  assert.equal(parseTokenAmount(formatTokenAmountDraft(full, 18, 18), 18), full)
})

test('formatTokenAmountDraft at human digits hides 1-wei dust (no …000001)', async () => {
  const { formatTokenAmountDraft, formatTokenAmount, parseTokenAmount } = await loadModule(
    '/src/core/exchange/token-amount.ts',
  )

  // 17906.752442 + 1 wei at 18 decimals — full precision leaks dust into the input.
  const withDust = 17906752442000000000001n
  assert.equal(formatTokenAmountDraft(withDust, 18, 18), '17906.752442000000000001')
  assert.equal(formatTokenAmountDraft(withDust, 18, 6), '17906.752442')

  // 展示四舍五入；草稿截断，避免 100% 填入上溢余额
  const halfUp = parseTokenAmount('1.2345675', 18)
  assert.equal(formatTokenAmount(halfUp, 18, 6), '1.234568')
  assert.equal(formatTokenAmountDraft(halfUp, 18, 6), '1.234567')
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

  // 数字第三参 = 展示位：与 formatNumber 一致，默认补足小数、四舍五入（禁 0.00→0）
  assert.equal(formatTokenAmount(10n ** 18n, 18), '1.0000')
  assert.equal(formatTokenAmount(1234567890000000000n, 18, 4), '1.2346')
  assert.equal(formatTokenAmount(0n, 18, 2), '0.00')

  // 100% fill path: full decimals must round-trip to exact balance (no dust).
  const dusty = 1234567890123456789n
  const full = formatTokenAmount(dusty, 18, 18)
  assert.equal(parseTokenAmount(full, 18), dusty)
  assert.notEqual(parseTokenAmount(formatTokenAmount(dusty, 18, 6), 18), dusty)

  // 显式 trimZeros 仍去尾零（输入草稿 / 紧凑展示）
  assert.equal(formatTokenAmount(10n ** 18n, 18, { digits: 4, trimZeros: true }), '1')
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
    '1,234.57',
  )
})

test('formatTokenAmount dust: positive below display floor → <0.01 / <0.0001', async () => {
  const { formatTokenAmount, formatTokenAmountDraft, parseTokenAmount, tokenDisplayFloorWei } =
    await loadModule('/src/core/exchange/token-amount.ts')

  // AGX 9 decimals, digits 2 → floor 0.01 AGX = 1e7 wei；四舍五入后仍为 0 才走粉尘
  assert.equal(tokenDisplayFloorWei(9, 2), 10n ** 7n)
  assert.equal(formatTokenAmount(1n, 9, 2), '<0.01')
  assert.equal(formatTokenAmount(5n * 10n ** 6n - 1n, 9, 2), '<0.01')
  assert.equal(formatTokenAmount(5n * 10n ** 6n, 9, 2), '0.01')
  assert.equal(formatTokenAmount(10n ** 7n - 1n, 9, 2), '0.01')
  assert.equal(formatTokenAmount(10n ** 7n, 9, 2), '0.01')
  assert.equal(formatTokenAmount(0n, 9, 2), '0.00')
  assert.equal(formatTokenAmount(0n, 9, { digits: 2, trimZeros: false }), '0.00')

  // digits 4 → <0.0001；0.00005 五入为 0.0001
  assert.equal(formatTokenAmount(1n, 9, 4), '<0.0001')
  assert.equal(formatTokenAmount(5n * 10n ** 4n - 1n, 9, 4), '<0.0001')
  assert.equal(formatTokenAmount(5n * 10n ** 4n, 9, 4), '0.0001')
  assert.equal(formatTokenAmount(10n ** 5n, 9, 4), '0.0001')

  // opt-out + draft stay parseable（对象默认仍 trim，便于草稿）
  assert.equal(formatTokenAmount(1n, 9, { digits: 2, dust: false }), '0')
  const draft = formatTokenAmountDraft(123n, 9, 9)
  assert.equal(draft, '0.000000123')
  assert.equal(parseTokenAmount(draft, 9), 123n)

  // digits 0: no "<0.…" dust label
  assert.equal(formatTokenAmount(1n, 9, 0), '0')
})

test('isAssetsActionableAmount is the 0.01 display floor', async () => {
  const { isAssetsActionableAmount, formatAssetsActionAmount, tokenDisplayFloorWei } =
    await loadModule('/src/core/exchange/token-amount.ts')

  const agxFloor = tokenDisplayFloorWei(9, 2)
  const xFloor = tokenDisplayFloorWei(18, 2)
  assert.equal(agxFloor, 10n ** 7n)
  assert.equal(xFloor, 10n ** 16n)

  assert.equal(isAssetsActionableAmount(0n, 9), false)
  assert.equal(isAssetsActionableAmount(agxFloor - 1n, 9), false)
  assert.equal(isAssetsActionableAmount(agxFloor, 9), true)
  assert.equal(isAssetsActionableAmount(xFloor - 1n, 18), false)
  assert.equal(isAssetsActionableAmount(xFloor, 18), true)

  assert.equal(formatAssetsActionAmount(0n, 9), '0.0000')
  assert.equal(formatAssetsActionAmount(agxFloor - 1n, 9), '0.0100')
  assert.equal(formatAssetsActionAmount(agxFloor, 9), '0.0100')
})

test('formatNumber is the human-number display core', async () => {
  const { formatNumber } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatNumber(1234.5, { digits: 2, trimZeros: false, prefix: '$' }), '$1,234.50')
  assert.equal(formatNumber(1234.5, { digits: 2, prefix: '$' }), '$1,234.50')
  assert.equal(formatNumber(1000, { digits: 0, trimZeros: true }), '1,000')
  assert.equal(formatNumber(42, { digits: 0, trimZeros: true }), '42')
})

test('slippagePercentToBps converts UI percent to basis points', async () => {
  const { slippagePercentToBps } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(slippagePercentToBps(0.5), 50)
  assert.equal(slippagePercentToBps(1), 100)
  assert.equal(slippagePercentToBps(99.99), 9999)
})

test('parseSlippagePercentInput treats empty as zero and clamps the cap', async () => {
  const { parseSlippagePercentInput } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(parseSlippagePercentInput(''), 0)
  assert.equal(parseSlippagePercentInput('0.3'), 0.3)
  assert.equal(parseSlippagePercentInput('99.99'), 99.99)
  assert.equal(parseSlippagePercentInput('abc'), 0)
  assert.equal(parseSlippagePercentInput('120'), 99.99)
})

test('switching slippage mode keeps a custom draft and never refills after clear', async () => {
  const { slippageDraftAfterModeChange } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(slippageDraftAfterModeChange('custom', 'auto', '', 1), '1')
  assert.equal(slippageDraftAfterModeChange('custom', 'auto', '', 2.5), '2.5')
  assert.equal(slippageDraftAfterModeChange('custom', 'auto', '4', 1), '4')
  assert.equal(slippageDraftAfterModeChange('auto', 'custom', '4', 1), '4')
  assert.equal(slippageDraftAfterModeChange('custom', 'auto', '4', 1), '4')
  assert.equal(slippageDraftAfterModeChange('custom', 'custom', '', 1), '')
  assert.equal(slippageDraftAfterModeChange('custom', 'custom', '', 26), '')
})

test('isAllowedSlippageDraft rejects values that would break amountOutMin', async () => {
  const { isAllowedSlippageDraft } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(isAllowedSlippageDraft(''), true)
  assert.equal(isAllowedSlippageDraft('0'), true)
  assert.equal(isAllowedSlippageDraft('0.3'), true)
  assert.equal(isAllowedSlippageDraft('2.5'), true)
  assert.equal(isAllowedSlippageDraft('99'), true)
  assert.equal(isAllowedSlippageDraft('99.'), true)
  assert.equal(isAllowedSlippageDraft('99.01'), true)
  assert.equal(isAllowedSlippageDraft('99.99'), true)
  assert.equal(isAllowedSlippageDraft('1.'), true)

  assert.equal(isAllowedSlippageDraft('.'), false)
  assert.equal(isAllowedSlippageDraft('-1'), false)
  assert.equal(isAllowedSlippageDraft('abc'), false)
  assert.equal(isAllowedSlippageDraft('1.234'), false)
  assert.equal(isAllowedSlippageDraft('99.991'), false)
  assert.equal(isAllowedSlippageDraft('100'), false)
  assert.equal(isAllowedSlippageDraft('120'), false)
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
