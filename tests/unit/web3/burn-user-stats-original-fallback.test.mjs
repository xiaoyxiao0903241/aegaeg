import assert from 'node:assert/strict'
import test from 'node:test'

import { parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { withAggregate3, withBscReadClient } from './_bsc-read-client-test.mjs'

const USER = '0x1111111111111111111111111111111111111111'
const ROOT = '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'
const ZERO = '0x0000000000000000000000000000000000000000'

const BURN_STATS_ABI = parseAbi([
  'function originalOf(address account) view returns (address)',
  'function userContribution(address user) view returns (uint256)',
  'function userAgxBurned(address user) view returns (uint256)',
  'function userContributionConsumed(address user) view returns (uint256)',
])

function createBurnStatsClient(opts) {
  return {
    readContract: withAggregate3(async (request) => {
      const fn = request.functionName
      if (fn === 'originalOf') return opts.originalOf
      if (fn === 'userContribution') {
        opts.onContribution?.(String(request.args[0]).toLowerCase())
        return 5n
      }
      if (fn === 'userAgxBurned') return 1n
      if (fn === 'userContributionConsumed') return 2n
      throw new Error(`unexpected ${fn}`)
    }, BURN_STATS_ABI),
  }
}

test('readBurnUserStats falls back to user when originalOf is zero', async () => {
  const { readBurnUserStats } = await loadModule('/src/web3/exchange/burn-exchange-read.ts')
  let contributionArg = ''
  const client = createBurnStatsClient({
    originalOf: ZERO,
    onContribution: (u) => {
      contributionArg = u
    },
  })
  const stats = await withBscReadClient(client, () => readBurnUserStats(USER))
  assert.equal(contributionArg, USER.toLowerCase())
  assert.equal(stats.contributionBalance, 5n)
  assert.equal(stats.contributionEarned, 7n)
})

test('readBurnUserStats uses originalOf when non-zero', async () => {
  const { readBurnUserStats } = await loadModule('/src/web3/exchange/burn-exchange-read.ts')
  let contributionArg = ''
  const client = createBurnStatsClient({
    originalOf: ROOT,
    onContribution: (u) => {
      contributionArg = u
    },
  })
  await withBscReadClient(client, () => readBurnUserStats(USER))
  assert.equal(contributionArg, ROOT.toLowerCase())
})
