import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('clampGenesisShares keeps empty draft at zero', async () => {
  const { clampGenesisShares } = await loadModule('/src/core/presale/presale-math.ts')

  assert.equal(clampGenesisShares(0, 40), 0)
  assert.equal(clampGenesisShares(0, 0), 0)
})

test('clampGenesisShares fails closed when maxShares is zero', async () => {
  const { clampGenesisShares } = await loadModule('/src/core/presale/presale-math.ts')

  assert.equal(clampGenesisShares(5, 0), 0)
  assert.equal(clampGenesisShares(5, -1), 0)
})

test('clampGenesisShares clamps above max and floors below one when drafting', async () => {
  const { clampGenesisShares } = await loadModule('/src/core/presale/presale-math.ts')

  assert.equal(clampGenesisShares(50, 40), 40)
  assert.equal(clampGenesisShares(1, 40), 1)
  assert.equal(clampGenesisShares(0.4, 40), 1)
})

test('formatGenesisSharesText mirrors empty draft for zero shares', async () => {
  const { formatGenesisSharesText } = await loadModule('/src/core/presale/presale-math.ts')

  assert.equal(formatGenesisSharesText(0), '')
  assert.equal(formatGenesisSharesText(12), '12')
})

test('canPurchaseGenesis fails closed when maxShares is zero', async () => {
  const { canPurchaseGenesis } = await loadModule('/src/core/presale/presale-math.ts')

  assert.equal(
    canPurchaseGenesis({
      walletReady: true,
      hasActivePhase: true,
      isBound: true,
      maxShares: 0,
      shares: 5,
      purchaseAmount: 500n * 10n ** 18n,
      minAmount: 100n * 10n ** 18n,
      maxPurchasableWei: 1000n * 10n ** 18n,
    }),
    false,
  )
})

test('canPurchaseGenesis requires live phase, share cap, and amount bounds', async () => {
  const { canPurchaseGenesis } = await loadModule('/src/core/presale/presale-math.ts')
  const base = {
    walletReady: true,
    hasActivePhase: true,
    isBound: true,
    maxShares: 40,
    shares: 10,
    purchaseAmount: 1000n * 10n ** 18n,
    minAmount: 100n * 10n ** 18n,
    maxPurchasableWei: 4000n * 10n ** 18n,
  }

  assert.equal(canPurchaseGenesis(base), true)
  assert.equal(canPurchaseGenesis({ ...base, hasActivePhase: false }), false)
  assert.equal(canPurchaseGenesis({ ...base, shares: 0 }), false)
  assert.equal(canPurchaseGenesis({ ...base, shares: 41 }), false)
  assert.equal(canPurchaseGenesis({ ...base, purchaseAmount: 50n * 10n ** 18n }), false)
  assert.equal(canPurchaseGenesis({ ...base, purchaseAmount: 5000n * 10n ** 18n }), false)
})

test('canPurchaseGenesis requires at least one share', async () => {
  const { canPurchaseGenesis } = await loadModule('/src/core/presale/presale-math.ts')

  assert.equal(
    canPurchaseGenesis({
      walletReady: true,
      hasActivePhase: true,
      isBound: true,
      maxShares: 40,
      shares: 0,
      purchaseAmount: 0n,
      minAmount: 100n * 10n ** 18n,
      maxPurchasableWei: 4000n * 10n ** 18n,
    }),
    false,
  )
})

test('canPurchaseGenesis fails closed when unbound or paused', async () => {
  const { canPurchaseGenesis } = await loadModule('/src/core/presale/presale-math.ts')
  const base = {
    walletReady: true,
    hasActivePhase: true,
    isBound: true,
    isPaused: false,
    maxShares: 40,
    shares: 10,
    purchaseAmount: 1000n * 10n ** 18n,
    minAmount: 100n * 10n ** 18n,
    maxPurchasableWei: 4000n * 10n ** 18n,
  }

  assert.equal(canPurchaseGenesis(base), true)
  assert.equal(canPurchaseGenesis({ ...base, isBound: false }), false)
  assert.equal(canPurchaseGenesis({ ...base, isPaused: true }), false)
})

test('liveQuotedOut ignores placeholder keepPreviousData', async () => {
  const { liveQuotedOut } = await loadModule('/src/core/exchange/live-quoted-out.ts')

  assert.equal(liveQuotedOut(true, 123n), 0n)
  assert.equal(liveQuotedOut(false, 123n), 123n)
  assert.equal(liveQuotedOut(false, undefined), 0n)
  assert.equal(liveQuotedOut(false, null), 0n)
})

test('canSubmitQuotedExchange blocks placeholder-zero and pending quotes', async () => {
  const { canSubmitQuotedExchange, liveQuotedOut } = await loadModule(
    '/src/core/exchange/live-quoted-out.ts',
  )

  const live = liveQuotedOut(false, 100n)
  const stale = liveQuotedOut(true, 100n)
  const nowMs = 1_000_000

  const base = {
    walletReady: true,
    amountIn: 10n,
    sellBalance: 100n,
    quotedOut: live,
    amountOutMin: 99n,
    isPlaceholderData: false,
    isQuotePending: false,
    isBalancesLoading: false,
    isSubmitting: false,
    quoteUpdatedAt: nowMs,
    maxQuoteAgeMs: 10_000,
    nowMs,
  }

  assert.equal(canSubmitQuotedExchange(base), true)
  assert.equal(canSubmitQuotedExchange({ ...base, quotedOut: stale, amountOutMin: 0n }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, isPlaceholderData: true }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, isQuotePending: true }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, amountIn: 200n }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, blockResubmit: true }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, isBalancesLoading: true }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, amountOutMin: 0n }), false)
  assert.equal(canSubmitQuotedExchange({ ...base, nowMs: nowMs + 10_001 }), false)
})

test('canSubmitQuotedExchange blockResubmit models unknown-tx double-submit latch', async () => {
  const { canSubmitQuotedExchange } = await loadModule('/src/core/exchange/live-quoted-out.ts')

  const base = {
    walletReady: true,
    amountIn: 10n,
    sellBalance: 100n,
    quotedOut: 100n,
    amountOutMin: 99n,
    isPlaceholderData: false,
    isQuotePending: false,
    isBalancesLoading: false,
    isSubmitting: false,
    quoteUpdatedAt: 1_000_000,
    maxQuoteAgeMs: 10_000,
    nowMs: 1_000_000,
  }

  assert.equal(canSubmitQuotedExchange(base), true)
  assert.equal(canSubmitQuotedExchange({ ...base, blockResubmit: true }), false)
})

test('assertQuotedExchangeStillSubmittable throws EXCHANGE_SUBMIT_BLOCKED when block fails', async () => {
  const { assertQuotedExchangeStillSubmittable, canSubmitQuotedExchange } = await loadModule(
    '/src/core/exchange/live-quoted-out.ts',
  )
  const { EXCHANGE_SUBMIT_BLOCKED } = await loadModule('/src/web3/contract-error-message.ts')

  const okParams = {
    walletReady: true,
    amountIn: 10n,
    sellBalance: 100n,
    quotedOut: 100n,
    amountOutMin: 99n,
    isPlaceholderData: false,
    isQuotePending: false,
    isBalancesLoading: false,
    // Mid-submit re-gate must pass isSubmitting:false (in-flight latch is separate).
    isSubmitting: false,
    quoteUpdatedAt: 1_000_000,
    maxQuoteAgeMs: 10_000,
    nowMs: 1_000_000,
  }

  assert.equal(canSubmitQuotedExchange(okParams), true)
  assert.doesNotThrow(() => assertQuotedExchangeStillSubmittable(okParams))

  assert.throws(
    () =>
      assertQuotedExchangeStillSubmittable({
        ...okParams,
        nowMs: 1_000_000 + 10_001,
      }),
    (error) => error instanceof Error && error.message === EXCHANGE_SUBMIT_BLOCKED,
  )
})

test('walletRemountKey clears draft identity on address change', async () => {
  const { walletRemountKey } = await loadModule('/src/shared/lib/wallet-remount-key.ts')

  assert.equal(walletRemountKey(undefined), 'disconnected')
  assert.equal(walletRemountKey(null), 'disconnected')
  assert.equal(walletRemountKey('0xAbC'), '0xabc')
  assert.notEqual(walletRemountKey('0xaaa'), walletRemountKey('0xbbb'))
  assert.notEqual(walletRemountKey('0xaaa'), walletRemountKey(undefined))
})

test('cappedTokenAmountRaw does not wipe draft while balances loading', async () => {
  const { cappedTokenAmountRaw } = await loadModule('/src/core/exchange/token-amount.ts')
  const balance = 5n * 10n ** 18n

  assert.equal(
    cappedTokenAmountRaw({
      amount: '9',
      sessionReady: true,
      balancesLoaded: false,
      balance: 0n,
      decimals: 18,
    }),
    '9',
  )
  assert.equal(
    cappedTokenAmountRaw({
      amount: '9',
      sessionReady: false,
      balancesLoaded: true,
      balance,
      decimals: 18,
    }),
    '9',
  )
})

test('cappedTokenAmountRaw re-caps when balance drops below draft', async () => {
  const { cappedTokenAmountRaw } = await loadModule('/src/core/exchange/token-amount.ts')
  const balance = 5n * 10n ** 18n

  assert.equal(
    cappedTokenAmountRaw({
      amount: '9',
      sessionReady: true,
      balancesLoaded: true,
      balance,
      decimals: 18,
    }),
    '5',
  )
  assert.equal(
    cappedTokenAmountRaw({
      amount: '3',
      sessionReady: true,
      balancesLoaded: true,
      balance,
      decimals: 18,
    }),
    '3',
  )
})

test('capTokenAmountInput is idempotent for already-capped input', async () => {
  const { capTokenAmountInput } = await loadModule('/src/core/exchange/token-amount.ts')
  const balance = 5n * 10n ** 18n

  const once = capTokenAmountInput('100', balance, 18)
  assert.equal(once, '5')
  assert.equal(capTokenAmountInput(once, balance, 18), once)
})

test('calcAmountOutMin rejects invalid slippage and floors with valid bps', async () => {
  const { calcAmountOutMin } = await loadModule('/src/core/exchange/exchange-math.ts')

  assert.equal(calcAmountOutMin(10_000n, 50), 9950n)
  assert.equal(calcAmountOutMin(1n, 9900), 1n)
  assert.throws(() => calcAmountOutMin(10_000n, -1))
  assert.throws(() => calcAmountOutMin(10_000n, 10_000))
})

test('emptySpotRateDash removed; formatExchangeRate* keep chrome on zero', async () => {
  const { formatExchangeRateApprox, formatExchangeRateColon } = await loadModule(
    '/src/views/dapp/exchange/shared.ts',
  )

  assert.equal(
    formatExchangeRateColon({
      amountIn: 10n ** 18n,
      amountOut: 0n,
      decimalsIn: 18,
      decimalsOut: 18,
    }),
    '1 : 0',
  )
  assert.equal(
    formatExchangeRateApprox({
      amountIn: 10n ** 18n,
      amountOut: 0n,
      decimalsIn: 18,
      decimalsOut: 18,
      symbolIn: 'USD1',
      symbolOut: 'AGX',
      fractionDigits: 6,
    }),
    '1 USD1 = 0.000000 AGX',
  )
})

test('metricDisplayText keeps prior on empty flash', async () => {
  const { metricDisplayText } = await loadModule('/src/shared/components/count-value.tsx')

  assert.deepEqual(metricDisplayText('', null), { display: '0', retain: null })
  assert.deepEqual(metricDisplayText('', '2,000'), { display: '2,000', retain: '2,000' })
  assert.deepEqual(metricDisplayText('3,000', '2,000'), {
    display: '3,000',
    retain: '3,000',
  })
  assert.deepEqual(metricDisplayText('0.00', '2,000'), {
    display: '0.00',
    retain: '0.00',
  })
})

test('parseLeadingMetricNumber: rebase countdown suffix still has digits (no DigitReel)', async () => {
  const { parseLeadingMetricNumber } = await loadModule('/src/shared/components/count-value.tsx')
  const parsed = parseLeadingMetricNumber('08 小时 27 分钟 13 秒')
  assert.ok(parsed)
  assert.equal(parsed.raw, '08')
  assert.match(parsed.suffix, /\d/)
})

test('viewsNeedingProvider mounts only active swap subviews', async () => {
  const { viewsNeedingProvider } = await loadModule('/src/views/dapp/exchange/shared.ts')

  assert.deepEqual(viewsNeedingProvider('hub', false, null, null), {
    flash: false,
    trade: false,
    burn: false,
    turbine: false,
  })
  assert.deepEqual(viewsNeedingProvider('burn', false, null, null), {
    flash: false,
    trade: false,
    burn: true,
    turbine: false,
  })
  assert.deepEqual(viewsNeedingProvider('turbine', false, null, null), {
    flash: false,
    trade: false,
    burn: false,
    turbine: true,
  })
  assert.deepEqual(viewsNeedingProvider('trade', false, null, null), {
    flash: false,
    trade: true,
    burn: false,
    turbine: false,
  })
  assert.deepEqual(viewsNeedingProvider('flash', false, null, null), {
    flash: true,
    trade: false,
    burn: false,
    turbine: false,
  })
  assert.deepEqual(viewsNeedingProvider('hub', true, 'trade', 'flash'), {
    flash: true,
    trade: true,
    burn: false,
    turbine: false,
  })
  assert.deepEqual(viewsNeedingProvider('trade', true, 'trade', 'hub'), {
    flash: false,
    trade: true,
    burn: false,
    turbine: false,
  })
  assert.deepEqual(viewsNeedingProvider('hub', true, 'burn', 'turbine'), {
    flash: false,
    trade: false,
    burn: true,
    turbine: true,
  })
})

test('ExchangeSessionHosts mounts via viewsNeedingProvider (no tab-wide prefetch)', async () => {
  const { readFile } = await import('node:fs/promises')
  const src = await readFile(
    new URL('../../../src/views/dapp/exchange/exchange-session-hosts.tsx', import.meta.url),
    'utf8',
  )
  assert.match(src, /viewsNeedingProvider/)
  assert.doesNotMatch(src, /flash:\s*true,\s*trade:\s*true,\s*burn:\s*true,\s*turbine:\s*true/)
})
