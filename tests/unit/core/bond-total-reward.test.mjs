import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const DECIMALS = 9
const ONE = 1_000_000_000n

test('bondTotalRewardWei: claimed API + unclaimed rebase', async () => {
  const { bondTotalRewardWei } = await loadModule('/src/core/assets/bond-total-reward.ts')

  assert.equal(bondTotalRewardWei({ claimedRaw: '1', unclaimedWei: 0n, decimals: DECIMALS }), ONE)
  assert.equal(
    bondTotalRewardWei({ claimedRaw: '1.5', unclaimedWei: 500_000_000n, decimals: DECIMALS }),
    2n * ONE,
  )
  assert.equal(
    bondTotalRewardWei({ claimedRaw: '0', unclaimedWei: 100n, decimals: DECIMALS }),
    100n,
  )
})

test('bondTotalRewardWei: missing or invalid claimed → null', async () => {
  const { bondTotalRewardWei } = await loadModule('/src/core/assets/bond-total-reward.ts')

  assert.equal(
    bondTotalRewardWei({ claimedRaw: null, unclaimedWei: ONE, decimals: DECIMALS }),
    null,
  )
  assert.equal(
    bondTotalRewardWei({ claimedRaw: undefined, unclaimedWei: ONE, decimals: DECIMALS }),
    null,
  )
  assert.equal(bondTotalRewardWei({ claimedRaw: '', unclaimedWei: ONE, decimals: DECIMALS }), null)
  assert.equal(
    bondTotalRewardWei({ claimedRaw: 'nope', unclaimedWei: ONE, decimals: DECIMALS }),
    null,
  )
  assert.equal(
    bondTotalRewardWei({ claimedRaw: '-1', unclaimedWei: ONE, decimals: DECIMALS }),
    null,
  )
})

test('assets bond position total yield wires claimed API plus chain profit', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/position/use-position.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /bondTotalRewardWei/)
  assert.match(src, /useBondFlowLpRewardTotal/)
  assert.match(src, /useBondFlowBurnRewardTotal/)
  assert.doesNotMatch(src, /总收益仍无累计 API/)
})
