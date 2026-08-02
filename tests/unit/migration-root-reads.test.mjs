import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

const CURRENT = '0x1111111111111111111111111111111111111111'
const ROOT = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
const ZERO = '0x0000000000000000000000000000000000000000'

function createMigrationAwareClient(opts) {
  return {
    async readContract(request) {
      const fn = request.functionName
      const arg0 = request.args?.[0]
      if (fn === 'migratedFrom') return opts.migratedFrom
      if (fn === 'stakes') {
        opts.onStakes?.(String(arg0))
        return [100n, 0n, 0n, 0n, true]
      }
      if (fn === 'warmupStakes') {
        return [0n, 0n, 0n, 0n, false]
      }
      if (fn === 'getStakeRewards') {
        opts.onRewards?.(String(arg0))
        return [0n, 1n]
      }
      if (fn === 'userTotalAmount') {
        opts.onUserTotal?.(String(arg0))
        return 42n
      }
      if (fn === 'userStakingAmounts') {
        opts.onUserStakingAmounts?.(String(arg0))
        return 10n
      }
      if (fn === 'isBindReferral') return true
      if (fn === 'balanceOf') return 1000n
      if (fn === 'allowance') return 1000n
      if (fn === 'remainingStakeAmount') return 1000n
      if (fn === 'status') return true
      if (fn === 'singleAddressLimit') return 0n
      if (fn === 'getStakesCount') return 0n
      throw new Error(`unexpected ${fn}`)
    },
  }
}

test('readStakePositions passes AMM root to liquid stakes and current to getStakeRewards', async () => {
  const { readStakePositions } = await loadModule('/src/web3/assets/assets-read.ts')
  let stakesArg = ''
  let rewardsArg = ''
  const client = createMigrationAwareClient({
    migratedFrom: ROOT,
    onStakes: (u) => {
      stakesArg = u.toLowerCase()
    },
    onRewards: (u) => {
      rewardsArg = u.toLowerCase()
    },
  })

  await readStakePositions(CURRENT, client)

  assert.equal(stakesArg, ROOT.toLowerCase())
  assert.equal(rewardsArg, CURRENT.toLowerCase())
})

test('readStakeRedeemableAmount liquid uses migration root for stakes', async () => {
  const { readStakeRedeemableAmount } = await loadModule('/src/web3/assets/assets-read.ts')
  let stakesArg = ''
  const client = createMigrationAwareClient({
    migratedFrom: ROOT,
    onStakes: (u) => {
      stakesArg = u.toLowerCase()
    },
  })

  const amount = await readStakeRedeemableAmount(
    {
      id: 'liquid',
      kind: 'liquid',
      period: 'liquid',
      pool: '0x0C5173c87aB8684eEc028a2bF56061a37415d224',
      stakeIndex: null,
      principal: 100n,
      releasedPrincipal: 0n,
      blockReward: 0n,
      extraInterest: 0n,
      claimableBalance: 0n,
      expiry: 0n,
    },
    CURRENT,
    client,
  )

  assert.equal(amount, 100n)
  assert.equal(stakesArg, ROOT.toLowerCase())
})

test('readStakeOpenPreflight locked userStakingAmounts uses migration root', async () => {
  const { readStakeOpenPreflight } = await loadModule('/src/web3/staking/staking-read.ts')
  let amountsArg = ''
  const client = createMigrationAwareClient({
    migratedFrom: ROOT,
    onUserStakingAmounts: (u) => {
      amountsArg = u.toLowerCase()
    },
  })

  await readStakeOpenPreflight({
    pool: '0x0F2d6c38Dd74D6bBd3aFc6DA90Af39e15CAb2858',
    isLiquid: false,
    user: CURRENT,
    client,
  })

  assert.equal(amountsArg, ROOT.toLowerCase())
})

test('readUserPresaleTotal uses migration root; zero migratedFrom keeps current', async () => {
  const { readUserPresaleTotal } = await loadModule('/src/web3/presale/presale-read.ts')

  let totalArg = ''
  const clientRoot = createMigrationAwareClient({
    migratedFrom: ROOT,
    onUserTotal: (u) => {
      totalArg = u.toLowerCase()
    },
  })
  assert.equal(await readUserPresaleTotal(CURRENT, clientRoot), 42n)
  assert.equal(totalArg, ROOT.toLowerCase())

  totalArg = ''
  const clientZero = createMigrationAwareClient({
    migratedFrom: ZERO,
    onUserTotal: (u) => {
      totalArg = u.toLowerCase()
    },
  })
  await readUserPresaleTotal(CURRENT, clientZero)
  assert.equal(totalArg, CURRENT.toLowerCase())
})
