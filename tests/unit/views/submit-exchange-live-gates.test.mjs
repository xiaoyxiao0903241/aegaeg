import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test, { afterEach } from 'node:test'

import { parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { ERC20_TEST_ABI, withAggregate3 } from '../web3/_bsc-read-client-test.mjs'
import {
  clearMoneyPathReadClient,
  enc,
  moneyPathSession,
  ok,
  ZERO,
} from './_money-path-read-mock.mjs'

afterEach(clearMoneyPathReadClient)

const TURBINE_UNLOCK_ABI = [
  ERC20_TEST_ABI,
  parseAbi([
    'function migratedFrom(address account) view returns (address)',
    'function turbineBalances(address user) view returns (uint256)',
    'function quoteUsdInForAgxOut(uint256 agxAmount) view returns (uint256)',
  ]),
]

test('submitTurbineClaim fail-closed when live position is not vested', async () => {
  const { submitTurbineClaim } = await loadModule(
    '/src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  )

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'isVested') return false
    throw new Error(`unexpected ${request.functionName}`)
  })

  const result = await submitTurbineClaim({
    core: {
      runSubmit: async (run) => {
        try {
          await run(session)
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
    index: 0,
    refetchSilences: async () => ({}),
  })

  assert.equal(result.ok, false)
  assert.ok(result.error instanceof Error)
  assert.equal(result.error.message, 'TURBINE_NOT_VESTED')
})

test('submitTurbineUnlock fail-closed when live quota is zero', async () => {
  const { submitTurbineUnlock } = await loadModule(
    '/src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  )

  const session = await moneyPathSession(
    withAggregate3(async (request) => {
      switch (request.functionName) {
        case 'migratedFrom':
          return ZERO
        case 'balanceOf':
          return 1_000n
        case 'allowance':
          return 1_000n
        case 'turbineBalances':
          return 0n
        case 'quoteUsdInForAgxOut':
          return 100n
        default:
          throw new Error(`unexpected ${request.functionName}`)
      }
    }, TURBINE_UNLOCK_ABI),
  )

  const result = await submitTurbineUnlock({
    core: {
      runSubmit: async (run) => {
        try {
          await run(session)
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
    unlockAmountAgx: 10n,
    slippageBps: 0,
  })

  assert.equal(result.ok, false)
  assert.ok(result.error instanceof Error)
  assert.equal(result.error.message, 'TURBINE_QUOTA_EXCEEDED')
})

test('submitTurbineUnlock quotes twice and does not requote inside approve', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/exchange/turbine/submit-turbine-exchange.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /approve: async \(\) => \{[\s\S]*?readTurbineUsdQuote/)

  const { submitTurbineUnlock } = await loadModule(
    '/src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  )

  let quotes = 0
  const session = await moneyPathSession(
    withAggregate3(async (request) => {
      switch (request.functionName) {
        case 'migratedFrom':
          return ZERO
        case 'balanceOf':
          return 1_000n
        case 'allowance':
          return 1_000n
        case 'turbineBalances':
          return 1_000n
        case 'quoteUsdInForAgxOut':
          quotes += 1
          return 100n
        default:
          throw new Error(`unexpected ${request.functionName}`)
      }
    }, TURBINE_UNLOCK_ABI),
  )

  const result = await submitTurbineUnlock({
    core: {
      runSubmit: async (run) => {
        try {
          await run(session)
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
    unlockAmountAgx: 10n,
    slippageBps: 0,
  })

  assert.equal(result.ok, false)
  assert.equal(quotes, 4)
})

test('submitTurbineUnlock uses preflight quote when allowance is short', async () => {
  const { submitTurbineUnlock } = await loadModule(
    '/src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  )

  let quotes = 0
  const session = await moneyPathSession(
    withAggregate3(async (request) => {
      switch (request.functionName) {
        case 'migratedFrom':
          return ZERO
        case 'balanceOf':
          return 1_000n
        case 'allowance':
          return 0n
        case 'turbineBalances':
          return 1_000n
        case 'quoteUsdInForAgxOut':
          quotes += 1
          return 100n
        default:
          throw new Error(`unexpected ${request.functionName}`)
      }
    }, TURBINE_UNLOCK_ABI),
  )

  const result = await submitTurbineUnlock({
    core: {
      runSubmit: async (run) => {
        try {
          await run(session)
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
    unlockAmountAgx: 10n,
    slippageBps: 0,
  })

  assert.equal(result.ok, false)
  assert.equal(quotes, 2)
})

test('submitTurbineUnlock pads quoted USD1 by slippage before balance check', async () => {
  const { submitTurbineUnlock } = await loadModule(
    '/src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  )

  const session = await moneyPathSession(
    withAggregate3(async (request) => {
      switch (request.functionName) {
        case 'migratedFrom':
          return ZERO
        case 'balanceOf':
          return 100n
        case 'allowance':
          return 1_000n
        case 'turbineBalances':
          return 1_000n
        case 'quoteUsdInForAgxOut': {
          const agx = request.args?.[0]
          if (agx === 10n) return 100n
          if (agx === 1_000n) return 10_000n
          throw new Error(`unexpected quote ${agx}`)
        }
        default:
          throw new Error(`unexpected ${request.functionName}`)
      }
    }, TURBINE_UNLOCK_ABI),
  )

  const result = await submitTurbineUnlock({
    core: {
      runSubmit: async (run) => {
        try {
          await run(session)
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
    unlockAmountAgx: 10n,
    slippageBps: 100,
  })

  assert.equal(result.ok, false)
  assert.ok(result.error instanceof Error)
  assert.equal(result.error.message, 'TURBINE_INSUFFICIENT_USD1')
})

test('submitTurbineUnlock caps full-quota unlock at the quota quote', async () => {
  const { submitTurbineUnlock } = await loadModule(
    '/src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  )

  let quotes = 0
  const session = await moneyPathSession(
    withAggregate3(async (request) => {
      switch (request.functionName) {
        case 'migratedFrom':
          return ZERO
        case 'balanceOf':
          return 100n
        case 'allowance':
          return 1_000n
        case 'turbineBalances':
          return 1_000n
        case 'quoteUsdInForAgxOut':
          quotes += 1
          return 100n
        default:
          throw new Error(`unexpected ${request.functionName}`)
      }
    }, TURBINE_UNLOCK_ABI),
  )

  const result = await submitTurbineUnlock({
    core: {
      runSubmit: async (run) => {
        try {
          await run(session)
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
    unlockAmountAgx: 1_000n,
    slippageBps: 100,
  })

  assert.equal(result.ok, false)
  assert.ok(result.error instanceof Error)
  assert.notEqual(result.error.message, 'TURBINE_INSUFFICIENT_USD1')
  assert.equal(quotes, 2)
})

test('submitBurnExchange fail-closed when live pool is paused', async () => {
  const { submitBurnExchange } = await loadModule(
    '/src/views/dapp/exchange/burn/submit-burn-exchange.ts',
  )
  const { BURN_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'aggregate3') {
      if (request.args[0].length === 2) {
        return [
          ok(enc('function balanceOf(address) view returns (uint256)', 'balanceOf', 1_000n)),
          ok(
            enc('function allowance(address,address) view returns (uint256)', 'allowance', 1_000n),
          ),
        ]
      }
      return [
        ok(
          enc(
            'function getConfig() view returns (address,uint8,uint256,bool,uint256,uint256,uint256,uint256)',
            'getConfig',
            [ZERO, 18, 10_000n, true, 1n, 0n, 0n, 0n],
          ),
        ),
        ok(
          enc(
            'function getSplitConfig() view returns (address,uint256,uint256,uint256,uint256)',
            'getSplitConfig',
            [ZERO, 5_000n, 0n, 0n, 0n],
          ),
        ),
        ok(enc('function contributionDivisor() view returns (uint256)', 'contributionDivisor', 6n)),
      ]
    }
    throw new Error(`unexpected ${request.functionName}`)
  })

  const result = await submitBurnExchange({
    core: {
      debouncedAmountIn: 100n,
      runQuotedSubmit: async (run) => {
        try {
          await run({
            session,
            assertStillSubmittable: () => {},
          })
          return { ok: true }
        } catch (error) {
          return { ok: false, error }
        }
      },
    },
  })

  assert.equal(result.ok, false)
  assert.ok(result.error instanceof Error)
  assert.equal(result.error.message, BURN_BLOCKED.paused)
})
