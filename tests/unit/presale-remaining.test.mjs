import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveRemainingUserAmount treats zero userPurchaseLimit as unlimited', async () => {
  const { resolveRemainingUserAmount } = await loadModule('/src/lib/presale/presale-math.ts')

  const phaseRemaining = {
    remainingPhaseAmount: 4000n * 10n ** 18n,
    remainingUserAmount: 0n,
    userPurchaseLimit: 0n,
    userPhaseAmountCurrent: 6000n * 10n ** 18n,
  }

  assert.equal(
    resolveRemainingUserAmount(phaseRemaining, null, 0n),
    4000n * 10n ** 18n,
  )
})

test('resolveRemainingUserAmount uses explicit remainingUserAmount when limit is set', async () => {
  const { resolveRemainingUserAmount } = await loadModule('/src/lib/presale/presale-math.ts')

  const phaseRemaining = {
    remainingPhaseAmount: 4000n * 10n ** 18n,
    remainingUserAmount: 2900n * 10n ** 18n,
    userPurchaseLimit: 8900n * 10n ** 18n,
    userPhaseAmountCurrent: 6000n * 10n ** 18n,
  }

  assert.equal(
    resolveRemainingUserAmount(phaseRemaining, null, 0n),
    2900n * 10n ** 18n,
  )
})

test('resolveRemainingUserAmount falls back to active phase when phaseRemaining missing', async () => {
  const { resolveRemainingUserAmount } = await loadModule('/src/lib/presale/presale-math.ts')

  const activePhase = {
    index: 0,
    minAmount: 100n * 10n ** 18n,
    maxAmount: 10000n * 10n ** 18n,
    discountBps: 3000n,
    airdropValueRatio: 500n,
    startTime: 0n,
    endTime: 0n,
    soldAmount: 6000n * 10n ** 18n,
    userPurchaseLimit: 0n,
    purchasedAmount: 6000n * 10n ** 18n,
  }

  assert.equal(
    resolveRemainingUserAmount(null, activePhase, 0n),
    4000n * 10n ** 18n,
  )
})

test('resolveGenesisMaxShares ignores zero remainingUserAmount when unlimited', async () => {
  const { resolveGenesisMaxShares } = await loadModule('/src/lib/presale/presale-math.ts')

  const sharePriceWei = 100n * 10n ** 18n
  const remainingPhaseAmount = 4000n * 10n ** 18n
  const remainingUserAmount = 4000n * 10n ** 18n
  const usd1Balance = 5000n * 10n ** 18n

  assert.equal(
    resolveGenesisMaxShares({
      sharePriceWei,
      remainingPhaseAmount,
      remainingUserAmount,
      usd1Balance,
      walletReady: true,
    }),
    40,
  )
})
