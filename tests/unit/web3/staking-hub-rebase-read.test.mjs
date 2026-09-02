import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

function baseRewardRateClient(ppm) {
  return {
    async readContract(request) {
      if (request.functionName === 'baseRewardRate') return ppm
      throw new Error(`unexpected ${request.functionName}`)
    },
  }
}

test('readLatestSagxRebaseRate maps 2500 ppm to 1e18 fraction and daily 2', async () => {
  const { readLatestSagxRebaseRate } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const snap = await withBscReadClient(baseRewardRateClient(2500n), () =>
    readLatestSagxRebaseRate(),
  )
  assert.equal(snap.rebaseRate1e18, 2_500_000_000_000_000n)
  assert.equal(snap.epochsPerDay, 2)
})

test('readLatestSagxRebaseRate maps 0 ppm to zero rate', async () => {
  const { readLatestSagxRebaseRate } = await loadModule(
    '/src/web3/staking/staking-hub-overview-read.ts',
  )

  const snap = await withBscReadClient(baseRewardRateClient(0n), () => readLatestSagxRebaseRate())
  assert.equal(snap.rebaseRate1e18, 0n)
  assert.equal(snap.epochsPerDay, 2)
})
