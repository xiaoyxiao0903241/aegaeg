import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const USER = '0x1111111111111111111111111111111111111111'
const ROOT = '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'
const ZERO = '0x0000000000000000000000000000000000000000'

function createBurnStatsClient(opts) {
  return {
    async readContract(request) {
      const fn = request.functionName
      if (fn === 'originalOf') return opts.originalOf
      if (fn === 'userContribution') {
        opts.onContribution?.(String(request.args[0]).toLowerCase())
        return 5n
      }
      if (fn === 'userAgxBurned') return 1n
      if (fn === 'userContributionConsumed') return 2n
      throw new Error(`unexpected ${fn}`)
    },
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
  const stats = await readBurnUserStats(USER, client)
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
  await readBurnUserStats(USER, client)
  assert.equal(contributionArg, ROOT.toLowerCase())
})
