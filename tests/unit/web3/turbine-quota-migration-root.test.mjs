import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from './_bsc-read-client-test.mjs'

const CURRENT = '0x1111111111111111111111111111111111111111'

test('readTurbineQuota reads turbineBalances for current wallet', async () => {
  const { readTurbineQuota } = await loadModule('/src/web3/exchange/turbine-exchange-read.ts')
  let balancesArg = ''
  const client = {
    async readContract(request) {
      if (request.functionName === 'turbineBalances') {
        balancesArg = String(request.args[0]).toLowerCase()
        return 77n
      }
      throw new Error(`unexpected ${request.functionName}`)
    },
  }
  assert.equal(await withBscReadClient(client, () => readTurbineQuota(CURRENT)), 77n)
  assert.equal(balancesArg, CURRENT.toLowerCase())
})
