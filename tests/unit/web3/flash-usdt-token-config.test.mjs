import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const OWNER = '0x1111111111111111111111111111111111111111'
const CONFIG_USDT = '0x2222222222222222222222222222222222222222'
const ZERO = '0x0000000000000000000000000000000000000000'

function createFlashConfigClient(opts) {
  return {
    async readContract(request) {
      const fn = request.functionName
      if (fn === 'getConfig') {
        return [
          opts.usdtToken,
          '0x3333333333333333333333333333333333333333',
          '0x4444444444444444444444444444444444444444',
          10_000n,
          18,
          18,
          false,
          0n,
          0n,
          1_000n,
        ]
      }
      if (fn === 'balanceOf') {
        opts.onBalance?.(
          String(request.address).toLowerCase(),
          String(request.args[0]).toLowerCase(),
        )
        return 11n
      }
      if (fn === 'allowance') {
        opts.onAllowance?.(String(request.address).toLowerCase())
        return 22n
      }
      throw new Error(`unexpected ${fn}`)
    },
  }
}

test('readUsd1SwapConfig captures usdtToken from getConfig', async () => {
  const { readUsd1SwapConfig } = await loadModule('/src/web3/exchange/flash-exchange-read.ts')
  const client = createFlashConfigClient({ usdtToken: CONFIG_USDT })
  const config = await readUsd1SwapConfig(client)
  assert.equal(config.usdtToken.toLowerCase(), CONFIG_USDT.toLowerCase())
})

test('readFlashPairBalances usdt path uses getConfig usdtToken not env', async () => {
  const { readFlashPairBalances } = await loadModule('/src/web3/exchange/flash-exchange-read.ts')
  const balanceTokens = []
  const client = createFlashConfigClient({
    usdtToken: CONFIG_USDT,
    onBalance: (token) => {
      balanceTokens.push(token)
    },
    onAllowance: (token) => {
      balanceTokens.push(token)
    },
  })

  const balances = await readFlashPairBalances('usdt', 'forward', OWNER, client)
  assert.equal(balances.sell, 11n)
  assert.equal(balances.approved, 22n)
  assert.ok(balanceTokens.includes(CONFIG_USDT.toLowerCase()))
  assert.equal(balanceTokens.filter((t) => t === CONFIG_USDT.toLowerCase()).length, 2)
})

test('readFlashPairBalances usdt path fails closed on zero usdtToken', async () => {
  const { readFlashPairBalances } = await loadModule('/src/web3/exchange/flash-exchange-read.ts')
  const client = createFlashConfigClient({ usdtToken: ZERO })
  await assert.rejects(() => readFlashPairBalances('usdt', 'forward', OWNER, client))
})
