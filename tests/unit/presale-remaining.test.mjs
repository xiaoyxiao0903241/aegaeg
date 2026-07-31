import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('remainingUserAmount treats zero userPurchaseLimit as unlimited', async () => {
  const { remainingUserAmount } = await loadModule('/src/core/presale/presale-math.ts')

  const phaseRemaining = {
    remainingPhaseAmount: 4000n * 10n ** 18n,
    remainingUserAmount: 0n,
    userPurchaseLimit: 0n,
    userPhaseAmountCurrent: 6000n * 10n ** 18n,
  }

  assert.equal(remainingUserAmount(phaseRemaining, null, 0n), 4000n * 10n ** 18n)
})

test('remainingUserAmount uses explicit remainingUserAmount when limit is set', async () => {
  const { remainingUserAmount } = await loadModule('/src/core/presale/presale-math.ts')

  const phaseRemaining = {
    remainingPhaseAmount: 4000n * 10n ** 18n,
    remainingUserAmount: 2900n * 10n ** 18n,
    userPurchaseLimit: 8900n * 10n ** 18n,
    userPhaseAmountCurrent: 6000n * 10n ** 18n,
  }

  assert.equal(remainingUserAmount(phaseRemaining, null, 0n), 2900n * 10n ** 18n)
})

test('remainingUserAmount falls back to phase inventory when unlimited', async () => {
  const { remainingUserAmount } = await loadModule('/src/core/presale/presale-math.ts')

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
  }

  assert.equal(remainingUserAmount(null, activePhase, 0n), 4000n * 10n ** 18n)
})

test('remainingUserAmount fails closed when limit set but remaining unread', async () => {
  const { remainingUserAmount } = await loadModule('/src/core/presale/presale-math.ts')

  const activePhase = {
    index: 0,
    minAmount: 100n * 10n ** 18n,
    maxAmount: 10000n * 10n ** 18n,
    discountBps: 3000n,
    airdropValueRatio: 500n,
    startTime: 0n,
    endTime: 0n,
    soldAmount: 6000n * 10n ** 18n,
    userPurchaseLimit: 10000n * 10n ** 18n,
  }

  assert.equal(remainingUserAmount(null, activePhase, 0n), 0n)
})

test('remainingPhaseAmount clamps oversold inventory to zero', async () => {
  const { remainingPhaseAmount } = await loadModule('/src/core/presale/presale-math.ts')

  const oversold = {
    index: 0,
    minAmount: 100n * 10n ** 18n,
    maxAmount: 10000n * 10n ** 18n,
    discountBps: 3000n,
    airdropValueRatio: 1000n,
    startTime: 0n,
    endTime: 0n,
    soldAmount: 4_016_300n * 10n ** 18n,
    userPurchaseLimit: 10000n * 10n ** 18n,
  }

  assert.equal(remainingPhaseAmount(null, oversold), 0n)
  assert.equal(
    remainingPhaseAmount(
      {
        remainingPhaseAmount: 10000n * 10n ** 18n,
        remainingUserAmount: 5000n * 10n ** 18n,
        userPurchaseLimit: 10000n * 10n ** 18n,
        userPhaseAmountCurrent: 5000n * 10n ** 18n,
      },
      oversold,
    ),
    10000n * 10n ** 18n,
  )
})

test('genesisMaxShares ignores zero remainingUserAmount when unlimited', async () => {
  const { genesisMaxShares } = await loadModule('/src/core/presale/presale-math.ts')

  const sharePriceWei = 100n * 10n ** 18n
  const remainingPhaseAmount = 4000n * 10n ** 18n
  const remainingUserAmount = 4000n * 10n ** 18n
  const usd1Balance = 5000n * 10n ** 18n

  assert.equal(
    genesisMaxShares({
      sharePriceWei,
      remainingPhaseAmount,
      remainingUserAmount,
      usd1Balance,
      walletReady: true,
    }),
    40,
  )
})
