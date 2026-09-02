import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const AGX = 10n ** 9n

test('bondPurchaseCapAgx: maxDebt 0 still caps at maxPayout net', async () => {
  const { bondPurchaseCapAgx } = await loadModule('/src/core/staking/format-bond-debt-remaining.ts')

  assert.equal(
    bondPurchaseCapAgx({
      maxPayoutAmount: 10n * AGX,
      maxDebt: 0n,
      totalDeposit: 100n * AGX,
      feeBps: 0n,
    }),
    10n * AGX,
  )
})

test('bondPurchaseCapAgx: remaining debt tighter than maxPayout', async () => {
  const { bondPurchaseCapAgx } = await loadModule('/src/core/staking/format-bond-debt-remaining.ts')

  assert.equal(
    bondPurchaseCapAgx({
      maxPayoutAmount: 10n * AGX,
      maxDebt: 5n * AGX,
      totalDeposit: 2n * AGX,
      feeBps: 0n,
    }),
    3n * AGX,
  )
})

test('bondPurchaseCapAgx: maxPayout tighter than remaining debt', async () => {
  const { bondPurchaseCapAgx } = await loadModule('/src/core/staking/format-bond-debt-remaining.ts')

  assert.equal(
    bondPurchaseCapAgx({
      maxPayoutAmount: 1n * AGX,
      maxDebt: 5n * AGX,
      totalDeposit: 2n * AGX,
      feeBps: 0n,
    }),
    1n * AGX,
  )
})

test('bondPurchaseCapAgx: sold out is zero', async () => {
  const { bondPurchaseCapAgx } = await loadModule('/src/core/staking/format-bond-debt-remaining.ts')

  assert.equal(
    bondPurchaseCapAgx({
      maxPayoutAmount: 10n * AGX,
      maxDebt: 2n * AGX,
      totalDeposit: 5n * AGX,
      feeBps: 0n,
    }),
    0n,
  )
})

test('bondPurchaseCapAgx: fee shrinks maxPayout before min with remaining', async () => {
  const { bondPurchaseCapAgx } = await loadModule('/src/core/staking/format-bond-debt-remaining.ts')

  // 10 AGX gross、10% fee → 9 AGX net；债务剩余 8 → 8
  assert.equal(
    bondPurchaseCapAgx({
      maxPayoutAmount: 10n * AGX,
      maxDebt: 20n * AGX,
      totalDeposit: 12n * AGX,
      feeBps: 1000n,
    }),
    8n * AGX,
  )

  // 债务不限时只剩扣费后的 maxPayout
  assert.equal(
    bondPurchaseCapAgx({
      maxPayoutAmount: 10n * AGX,
      maxDebt: 0n,
      totalDeposit: 0n,
      feeBps: 1000n,
    }),
    9n * AGX,
  )
})
