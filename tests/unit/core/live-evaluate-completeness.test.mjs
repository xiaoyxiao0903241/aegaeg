import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('evaluateTurbineUnlockLive requires allowance cover liveUsd', async () => {
  const { evaluateTurbineUnlockLive } = await loadModule(
    '/src/core/exchange/turbine-unlock-live.ts',
  )
  const base = {
    unlockAmountAgx: 1n,
    liveUsd: 100n,
    liveQuota: 10n,
    usd1: 200n,
    approved: 100n,
  }
  assert.equal(evaluateTurbineUnlockLive(base), null)
  assert.equal(
    evaluateTurbineUnlockLive({ ...base, approved: 99n }),
    'TURBINE_INSUFFICIENT_ALLOWANCE',
  )
  assert.equal(evaluateTurbineUnlockLive({ ...base, approved: 99n, grantedUsd: 100n }), null)
  assert.equal(evaluateTurbineUnlockLive({ ...base, approved: 0n, grantedUsd: 100n }), null)
  assert.equal(
    evaluateTurbineUnlockLive({ ...base, liveUsd: 101n, approved: 0n, grantedUsd: 100n }),
    'TURBINE_QUOTE_EXCEEDS_APPROVAL',
  )
  assert.equal(evaluateTurbineUnlockLive({ ...base, liveQuota: 0n }), 'TURBINE_QUOTA_EXCEEDED')
})

test('resolveTurbineSlippagePercent defaults to 1 and parses custom', async () => {
  const { resolveTurbineSlippagePercent, TURBINE_AUTO_SLIPPAGE_PERCENT } = await loadModule(
    '/src/core/exchange/turbine-unlock-live.ts',
  )
  assert.equal(TURBINE_AUTO_SLIPPAGE_PERCENT, 1)
  assert.equal(resolveTurbineSlippagePercent('auto', ''), 1)
  assert.equal(resolveTurbineSlippagePercent('custom', ''), 1)
  assert.equal(resolveTurbineSlippagePercent('custom', '3'), 3)
})

test('isTurbineQuotaCapReady rejects keepPreviousData placeholder cap', async () => {
  const { isTurbineQuotaCapReady } = await loadModule('/src/core/exchange/turbine-unlock-live.ts')
  const staleQuotaQuote = 9_999n
  assert.equal(
    isTurbineQuotaCapReady({
      needsQuotaCapQuote: false,
      isPlaceholderData: true,
      quotedQuota: staleQuotaQuote,
    }),
    true,
  )
  assert.equal(
    isTurbineQuotaCapReady({
      needsQuotaCapQuote: true,
      isPlaceholderData: true,
      quotedQuota: staleQuotaQuote,
    }),
    false,
  )
  assert.equal(
    isTurbineQuotaCapReady({
      needsQuotaCapQuote: true,
      isPlaceholderData: false,
      quotedQuota: staleQuotaQuote,
    }),
    true,
  )
  assert.equal(
    isTurbineQuotaCapReady({
      needsQuotaCapQuote: true,
      isPlaceholderData: false,
      quotedQuota: undefined,
    }),
    false,
  )
})

test('calcTurbinePayableUsd pads then caps at full-quota quote', async () => {
  const { calcTurbinePayableUsd } = await loadModule('/src/core/exchange/turbine-unlock-live.ts')
  assert.equal(calcTurbinePayableUsd(500n, 10_000n, 100), 505n)
  assert.equal(calcTurbinePayableUsd(500n, 502n, 100), 502n)
  assert.equal(calcTurbinePayableUsd(500n, 500n, 100), 500n)
  assert.equal(calcTurbinePayableUsd(0n, 500n, 250), 0n)
  assert.equal(calcTurbinePayableUsd(500n, 0n, 100), 505n)
})

test('evaluateTurbineClaimLive blocks when not vested', async () => {
  const { evaluateTurbineClaimLive } = await loadModule('/src/core/exchange/turbine-unlock-live.ts')
  assert.equal(evaluateTurbineClaimLive(true), null)
  assert.equal(evaluateTurbineClaimLive(false), 'TURBINE_NOT_VESTED')
})

test('evaluateLiquidWarmupClaimLive blocks before expiry', async () => {
  const { evaluateLiquidWarmupClaimLive } = await loadModule(
    '/src/core/staking/staking-block-reasons.ts',
  )
  assert.equal(evaluateLiquidWarmupClaimLive(true), null)
  assert.equal(evaluateLiquidWarmupClaimLive(false), 'unavailable')
})

test('evaluateGenesisPurchaseAmountLive fails when remaining drifts below purchase', async () => {
  const { evaluateGenesisPurchaseAmountLive } = await loadModule(
    '/src/core/presale/presale-math.ts',
  )
  assert.equal(
    evaluateGenesisPurchaseAmountLive({
      purchaseAmount: 100n,
      remainingPhaseAmount: 100n,
      remainingUserAmount: 100n,
    }),
    true,
  )
  assert.equal(
    evaluateGenesisPurchaseAmountLive({
      purchaseAmount: 100n,
      remainingPhaseAmount: 99n,
      remainingUserAmount: 100n,
    }),
    false,
  )
})
