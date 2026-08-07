import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const CURRENT = '0x1111111111111111111111111111111111111111'
const ROOT = '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'
const ZERO = '0x0000000000000000000000000000000000000000'

function createTurbineQuotaClient(opts) {
  return {
    async readContract(request) {
      const fn = request.functionName
      if (fn === 'migratedFrom') {
        return opts.migratedFrom
      }
      if (fn === 'turbineBalances') {
        opts.onBalances?.(String(request.args[0]).toLowerCase())
        return 77n
      }
      throw new Error(`unexpected ${fn}`)
    },
  }
}

test('readTurbineQuota uses migrationStakeRoot for turbineBalances', async () => {
  const { readTurbineQuota } = await loadModule('/src/web3/exchange/turbine-exchange-read.ts')
  let balancesArg = ''
  const client = createTurbineQuotaClient({
    migratedFrom: ROOT,
    onBalances: (u) => {
      balancesArg = u
    },
  })
  assert.equal(await readTurbineQuota(CURRENT, client), 77n)
  assert.equal(balancesArg, ROOT.toLowerCase())
})

test('readTurbineQuota keeps current when migratedFrom is zero', async () => {
  const { readTurbineQuota } = await loadModule('/src/web3/exchange/turbine-exchange-read.ts')
  let balancesArg = ''
  const client = createTurbineQuotaClient({
    migratedFrom: ZERO,
    onBalances: (u) => {
      balancesArg = u
    },
  })
  await readTurbineQuota(CURRENT, client)
  assert.equal(balancesArg, CURRENT.toLowerCase())
})
