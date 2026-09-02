import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('decisionBigint treats placeholder as unknown (wallet-switch keepPreviousData)', async () => {
  const { decisionBigint, isDecisionFresh } = await loadModule(
    '/src/core/query/decision-freshness.ts',
  )

  // 钱包 A→B：新 key 下 data 仍是 A 的余额，但 isPlaceholderData=true。
  const previousWalletBalance = 1_000n
  assert.equal(decisionBigint(previousWalletBalance, true), undefined)
  assert.equal(isDecisionFresh(true, previousWalletBalance), false)

  assert.equal(decisionBigint(previousWalletBalance, false), previousWalletBalance)
  assert.equal(isDecisionFresh(false, previousWalletBalance), true)
  assert.equal(isDecisionFresh(false, undefined), false)
})

test('decision axis zeros while paint axis may keep previous (contract)', async () => {
  const { decisionBigint, isDecisionFresh } = await loadModule(
    '/src/core/query/decision-freshness.ts',
  )
  const paint = 5_000n
  const placeholder = true
  const decision = decisionBigint(paint, placeholder) ?? 0n
  const paintKnown = paint !== undefined
  assert.equal(decision, 0n)
  assert.equal(paintKnown, true)
  assert.equal(isDecisionFresh(placeholder, paint), false)
})
