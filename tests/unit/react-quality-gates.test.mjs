import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

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
  assert.equal(
    canPurchaseGenesis({ ...base, purchaseAmount: 5000n * 10n ** 18n }),
    false,
  )
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

test('resolveLiveQuotedOut ignores placeholder keepPreviousData', async () => {
  const { resolveLiveQuotedOut } = await loadModule('/src/core/swap/resolve-live-quoted-out.ts')

  assert.equal(resolveLiveQuotedOut(true, 123n), 0n)
  assert.equal(resolveLiveQuotedOut(false, 123n), 123n)
  assert.equal(resolveLiveQuotedOut(false, undefined), 0n)
  assert.equal(resolveLiveQuotedOut(false, null), 0n)
})

test('canSubmitQuotedSwap blocks placeholder-zero and pending quotes', async () => {
  const { canSubmitQuotedSwap, resolveLiveQuotedOut } = await loadModule(
    '/src/core/swap/resolve-live-quoted-out.ts',
  )

  const live = resolveLiveQuotedOut(false, 100n)
  const stale = resolveLiveQuotedOut(true, 100n)
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

  assert.equal(canSubmitQuotedSwap(base), true)
  assert.equal(canSubmitQuotedSwap({ ...base, quotedOut: stale, amountOutMin: 0n }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, isPlaceholderData: true }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, isQuotePending: true }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, amountIn: 200n }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, blockResubmit: true }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, isBalancesLoading: true }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, amountOutMin: 0n }), false)
  assert.equal(canSubmitQuotedSwap({ ...base, nowMs: nowMs + 10_001 }), false)
})

test('canSubmitQuotedSwap blockResubmit models unknown-tx double-submit latch', async () => {
  const { canSubmitQuotedSwap } = await loadModule('/src/core/swap/resolve-live-quoted-out.ts')

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

  assert.equal(canSubmitQuotedSwap(base), true)
  assert.equal(canSubmitQuotedSwap({ ...base, blockResubmit: true }), false)
})

test('assertQuotedSwapStillSubmittable throws SWAP_SUBMIT_GATE_FAILED when gate fails', async () => {
  const { assertQuotedSwapStillSubmittable, canSubmitQuotedSwap } = await loadModule(
    '/src/core/swap/resolve-live-quoted-out.ts',
  )
  const { SWAP_SUBMIT_GATE_FAILED } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

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

  assert.equal(canSubmitQuotedSwap(okParams), true)
  assert.doesNotThrow(() => assertQuotedSwapStillSubmittable(okParams))

  assert.throws(
    () =>
      assertQuotedSwapStillSubmittable({
        ...okParams,
        nowMs: 1_000_000 + 10_001,
      }),
    (error) => error instanceof Error && error.message === SWAP_SUBMIT_GATE_FAILED,
  )
})

test('resolveWalletRemountKey clears draft identity on address change', async () => {
  const { resolveWalletRemountKey } = await loadModule(
    '/src/shared/lib/resolve-wallet-remount-key.ts',
  )

  assert.equal(resolveWalletRemountKey(undefined), 'disconnected')
  assert.equal(resolveWalletRemountKey(null), 'disconnected')
  assert.equal(resolveWalletRemountKey('0xAbC'), '0xabc')
  assert.notEqual(
    resolveWalletRemountKey('0xaaa'),
    resolveWalletRemountKey('0xbbb'),
  )
  assert.notEqual(resolveWalletRemountKey('0xaaa'), resolveWalletRemountKey(undefined))
})

test('resolveCappedTokenAmountRaw does not wipe draft while balances loading', async () => {
  const { resolveCappedTokenAmountRaw } = await loadModule('/src/core/swap/token-amount.ts')
  const balance = 5n * 10n ** 18n

  assert.equal(
    resolveCappedTokenAmountRaw({
      amount: '9',
      sessionReady: true,
      balancesLoaded: false,
      balance: 0n,
      decimals: 18,
    }),
    '9',
  )
  assert.equal(
    resolveCappedTokenAmountRaw({
      amount: '9',
      sessionReady: false,
      balancesLoaded: true,
      balance,
      decimals: 18,
    }),
    '9',
  )
})

test('resolveCappedTokenAmountRaw re-caps when balance drops below draft', async () => {
  const { resolveCappedTokenAmountRaw } = await loadModule('/src/core/swap/token-amount.ts')
  const balance = 5n * 10n ** 18n

  assert.equal(
    resolveCappedTokenAmountRaw({
      amount: '9',
      sessionReady: true,
      balancesLoaded: true,
      balance,
      decimals: 18,
    }),
    '5',
  )
  assert.equal(
    resolveCappedTokenAmountRaw({
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
  const { capTokenAmountInput } = await loadModule('/src/core/swap/token-amount.ts')
  const balance = 5n * 10n ** 18n

  const once = capTokenAmountInput('100', balance, 18)
  assert.equal(once, '5')
  assert.equal(capTokenAmountInput(once, balance, 18), once)
})

test('calcAmountOutMin rejects invalid slippage and floors with valid bps', async () => {
  const { calcAmountOutMin } = await loadModule('/src/core/swap/calc-amount-out-min.ts')

  assert.equal(calcAmountOutMin(10_000n, 50), 9950n)
  assert.equal(calcAmountOutMin(1n, 9900), 1n)
  assert.throws(() => calcAmountOutMin(10_000n, -1))
  assert.throws(() => calcAmountOutMin(10_000n, 10_000))
})

test('resolveEmptySpotRatePlaceholder gates empty vs format', async () => {
  const { resolveEmptySpotRatePlaceholder } = await loadModule(
    '/src/views/dapp/swap/swap-format-rate.ts',
  )

  assert.equal(resolveEmptySpotRatePlaceholder(0n, true), '')
  assert.equal(resolveEmptySpotRatePlaceholder(0n, false), '—')
  assert.equal(resolveEmptySpotRatePlaceholder(1n, false), null)
  assert.equal(resolveEmptySpotRatePlaceholder(1n, true), null)
})

test('viewsNeedingProvider mounts only active swap subviews', async () => {
  const { viewsNeedingProvider } = await loadModule(
    '/src/views/dapp/swap/swap-views-needing-provider.ts',
  )

  assert.deepEqual(viewsNeedingProvider('hub', false, null, null), {
    flash: false,
    trade: false,
  })
  assert.deepEqual(viewsNeedingProvider('trade', false, null, null), {
    flash: false,
    trade: true,
  })
  assert.deepEqual(viewsNeedingProvider('flash', false, null, null), {
    flash: true,
    trade: false,
  })
  assert.deepEqual(viewsNeedingProvider('hub', true, 'trade', 'flash'), {
    flash: true,
    trade: true,
  })
  assert.deepEqual(viewsNeedingProvider('trade', true, 'trade', 'hub'), {
    flash: false,
    trade: true,
  })
})
