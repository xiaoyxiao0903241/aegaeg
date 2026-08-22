import assert from 'node:assert/strict'
import test, { afterEach } from 'node:test'

import { loadModule } from '../load-module.mjs'
import {
  clearMoneyPathReadClient,
  enc,
  moneyPathSession,
  ok,
  ZERO,
} from './_money-path-read-mock.mjs'

afterEach(clearMoneyPathReadClient)

function stakeLockedAggregate3(calls, opts) {
  const {
    isBound = true,
    balance = 1_000n,
    allowance = 1_000n,
    remaining = 1_000n,
    poolOpen = true,
  } = opts

  if (calls.length === 5) {
    return [
      ok(enc('function isBindReferral(address) view returns (bool)', 'isBindReferral', isBound)),
      ok(enc('function balanceOf(address) view returns (uint256)', 'balanceOf', balance)),
      ok(enc('function allowance(address,address) view returns (uint256)', 'allowance', allowance)),
      ok(
        enc(
          'function remainingStakeAmount() view returns (uint256)',
          'remainingStakeAmount',
          remaining,
        ),
      ),
      ok(enc('function migratedFrom(address) view returns (address)', 'migratedFrom', ZERO)),
    ]
  }

  if (calls.length === 3) {
    return [
      ok(enc('function status() view returns (bool)', 'status', poolOpen)),
      ok(enc('function singleAddressLimit() view returns (uint256)', 'singleAddressLimit', 0n)),
      ok(
        enc(
          'function userStakingAmounts(address) view returns (uint256)',
          'userStakingAmounts',
          0n,
        ),
      ),
    ]
  }

  throw new Error(`unexpected aggregate3 arity ${calls.length}`)
}

test('submitStakeOpen fail-closed when live referral is unbound', async () => {
  const { submitStakeOpen } = await loadModule('/src/views/dapp/staking/stake/submit-stake.ts')
  const { STAKING_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'aggregate3') {
      return stakeLockedAggregate3(request.args[0], { isBound: false })
    }
    if (request.functionName === 'migrationEnabled') return false
    if (request.functionName === 'isOldAccount') return false
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () => submitStakeOpen({ session, period: '180', amount: 100n }),
    (err) => err === STAKING_BLOCKED.notBound,
  )
})

test('submitStakeOpen fail-closed when live quota is below amount', async () => {
  const { submitStakeOpen } = await loadModule('/src/views/dapp/staking/stake/submit-stake.ts')
  const { STAKING_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName === 'aggregate3') {
      return stakeLockedAggregate3(request.args[0], { remaining: 10n })
    }
    if (request.functionName === 'migrationEnabled') return false
    if (request.functionName === 'isOldAccount') return false
    throw new Error(`unexpected ${request.functionName}`)
  })

  await assert.rejects(
    () => submitStakeOpen({ session, period: '180', amount: 100n }),
    (err) => err === STAKING_BLOCKED.insufficientQuota,
  )
})

test('submitXmineStake fail-closed when live mining quota is exhausted', async () => {
  // submit-xmine imports navigation → host store needs a browser-like location.
  const previousWindow = globalThis.window
  globalThis.window = {
    location: { hash: '', pathname: '/', search: '' },
    history: { replaceState() {} },
  }

  try {
    const { submitXmineStake } = await loadModule('/src/views/dapp/staking/xmine/submit-xmine.ts')
    const { XMINE_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

    const session = await moneyPathSession(async (request) => {
      if (request.functionName === 'aggregate3') {
        return [
          ok(enc('function balanceOf(address) view returns (uint256)', 'balanceOf', 1_000n)),
          ok(
            enc('function allowance(address,address) view returns (uint256)', 'allowance', 1_000n),
          ),
          ok(enc('function miningQuotaOf(address) view returns (uint256)', 'miningQuotaOf', 50n)),
          ok(
            enc(
              'function miningStakeAmountOf(address) view returns (uint256)',
              'miningStakeAmountOf',
              50n,
            ),
          ),
        ]
      }
      if (request.functionName === 'migrationEnabled') return false
      if (request.functionName === 'isOldAccount') return false
      throw new Error(`unexpected ${request.functionName}`)
    })

    await assert.rejects(
      () => submitXmineStake({ session, amount: 100n }),
      (err) => err === XMINE_BLOCKED.insufficientQuota,
    )
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})

test('submitLiquidWarmupClaim fail-closed when warmup has not expired', async () => {
  const { submitLiquidWarmupClaim } = await loadModule(
    '/src/web3/staking/submit-liquid-warmup-claim.ts',
  )
  const { STAKING_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  const session = await moneyPathSession(async (request) => {
    if (request.functionName !== 'aggregate3') {
      throw new Error(`unexpected ${request.functionName}`)
    }
    const calls = request.args[0]
    // liquid round1 = 7 calls
    if (calls.length === 7) {
      return [
        ok(enc('function isBindReferral(address) view returns (bool)', 'isBindReferral', true)),
        ok(enc('function balanceOf(address) view returns (uint256)', 'balanceOf', 0n)),
        ok(enc('function allowance(address,address) view returns (uint256)', 'allowance', 0n)),
        ok(
          enc('function remainingStakeAmount() view returns (uint256)', 'remainingStakeAmount', 0n),
        ),
        ok(enc('function isWarmupExpired(address) view returns (bool)', 'isWarmupExpired', false)),
        ok(enc('function migratedFrom(address) view returns (address)', 'migratedFrom', ZERO)),
        ok(enc('function timeBucket() view returns (uint256)', 'timeBucket', 1n)),
      ]
    }
    // liquid round2 = 4 calls (readStakeOpenPreflight always finishes both rounds)
    if (calls.length === 4) {
      return [
        ok(enc('function singleAddressLimit() view returns (uint256)', 'singleAddressLimit', 0n)),
        ok(
          enc(
            'function singleAddressDailyLimit() view returns (uint256)',
            'singleAddressDailyLimit',
            0n,
          ),
        ),
        ok(
          enc(
            'function userStakingAmounts(address) view returns (uint256)',
            'userStakingAmounts',
            0n,
          ),
        ),
        ok(
          enc(
            'function userDailyStakingAmounts(uint256,address) view returns (uint256)',
            'userDailyStakingAmounts',
            0n,
          ),
        ),
      ]
    }
    throw new Error(`unexpected aggregate3 arity ${calls.length}`)
  })

  await assert.rejects(
    () => submitLiquidWarmupClaim({ session }),
    (err) => err === STAKING_BLOCKED.unavailable,
  )
})
