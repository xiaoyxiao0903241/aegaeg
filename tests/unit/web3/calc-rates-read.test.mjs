import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

test('readCalcLiveRates only reads epoch length, not rebase history', async () => {
  const { readCalcLiveRates } = await loadModule('/src/web3/staking/calc-rates-read.ts')
  const { epochsPerDayFromLength } = await loadModule('/src/core/staking/staking-yield.ts')
  const { BSC_BLOCK_SECONDS } = await loadModule('/src/shared/lib/constants.ts')

  const epochLength = 19_200n
  let calls = 0
  const client = {
    async readContract({ functionName }) {
      calls += 1
      if (functionName === 'epoch') return [epochLength, 2n, 0n, 0n]
      throw new Error(`unexpected ${functionName}`)
    },
  }

  const rates = await withBscReadClient(client, () => readCalcLiveRates())
  assert.equal(rates.epochsPerDay, epochsPerDayFromLength(epochLength, BSC_BLOCK_SECONDS))
  assert.equal(calls, 1)
})
