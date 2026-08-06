import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('formatBondDebtRemainingDisplay: maxDebt 0 is unlimited', async () => {
  const { formatBondDebtRemainingDisplay } = await loadModule(
    '/src/core/staking/format-bond-debt-remaining.ts',
  )
  assert.deepEqual(formatBondDebtRemainingDisplay(0n, 100n, 18, 2), { kind: 'unlimited' })
})

test('formatBondDebtRemainingDisplay: remaining is AGX debt units', async () => {
  const { formatBondDebtRemainingDisplay } = await loadModule(
    '/src/core/staking/format-bond-debt-remaining.ts',
  )
  const one = 10n ** 18n
  const out = formatBondDebtRemainingDisplay(5n * one, 2n * one, 18, 2)
  assert.equal(out.kind, 'amount')
  assert.equal(out.label, '3')
})

test('formatBondDebtRemainingDisplay: sold out shows zero', async () => {
  const { formatBondDebtRemainingDisplay } = await loadModule(
    '/src/core/staking/format-bond-debt-remaining.ts',
  )
  const one = 10n ** 18n
  const out = formatBondDebtRemainingDisplay(2n * one, 5n * one, 18, 2)
  assert.deepEqual(out, { kind: 'amount', label: '0' })
})
