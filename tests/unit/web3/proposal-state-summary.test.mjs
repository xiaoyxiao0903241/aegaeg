import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('decodeProposalStateSummary reads named or indexed uint256 counts', async () => {
  const { decodeProposalStateSummary } = await loadModule('/src/web3/proposal/proposal-read.ts')
  assert.deepEqual(
    decodeProposalStateSummary({
      total: 12n,
      pending: 3n,
      active: 2n,
      succeeded: 4n,
      defeated: 1n,
      canceled: 1n,
      executed: 1n,
    }),
    { total: 12, pending: 3, active: 2 },
  )
  assert.deepEqual(decodeProposalStateSummary([9n, 1n, 4n, 0n, 0n, 0n, 4n]), {
    total: 9,
    pending: 1,
    active: 4,
  })
})

test('decodeProposalStateSummary rejects unsafe or non-count values', async () => {
  const { decodeProposalStateSummary } = await loadModule('/src/web3/proposal/proposal-read.ts')
  assert.throws(() => decodeProposalStateSummary({ total: -1, pending: 0, active: 0 }))
  assert.throws(() =>
    decodeProposalStateSummary({
      total: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
      pending: 0n,
      active: 0n,
    }),
  )
  assert.throws(() => decodeProposalStateSummary({ total: '12', pending: 0n, active: 0n }))
})
