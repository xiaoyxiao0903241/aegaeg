import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildSeasonOptions marks active phase from chain timestamps', async () => {
  const { buildSeasonOptions } = await loadModule('/src/views/dapp/genesis/genesis-season-options.ts')
  const now = 1_700_000_000

  const phases = [
    {
      index: 0,
      minAmount: 100n,
      maxAmount: 1000n,
      discountBps: 3000n,
      airdropValueRatio: 500n,
      startTime: BigInt(now - 10_000),
      endTime: BigInt(now + 10_000),
      soldAmount: 500n,
      userPurchaseLimit: 10_000n,
    },
    {
      index: 1,
      minAmount: 100n,
      maxAmount: 1000n,
      discountBps: 2500n,
      airdropValueRatio: 200n,
      startTime: BigInt(now + 20_000),
      endTime: BigInt(now + 40_000),
      soldAmount: 0n,
      userPurchaseLimit: 20_000n,
    },
  ]

  const seasons = buildSeasonOptions(phases, 55, now)
  assert.equal(seasons[0]?.active, true)
  assert.equal(seasons[0]?.status, 'LIVE')
  assert.equal(seasons[1]?.status, 'Upcoming')
})

test('normalizeTeamRewardClaim accepts snake_case fields', async () => {
  const { normalizeTeamRewardClaim } = await loadModule(
    '/src/shared/api/normalize-team-reward-claim.ts',
  )

  const normalized = normalizeTeamRewardClaim({
    signature: '0xabc',
    salt: '0xsalt',
    amount_wei: '1000000000000000000',
    sign_type: '1',
    expire_time: '1735689600',
  })

  assert.equal(normalized.signature, '0xabc')
  assert.equal(normalized.salt, '0xsalt')
  assert.equal(normalized.amountWei, 1000000000000000000n)
  assert.equal(normalized.signType, 1n)
  assert.equal(normalized.expireTime, 1735689600n)
})

test('normalizeTeamRewardClaim accepts camelCase and decimal amount', async () => {
  const { normalizeTeamRewardClaim } = await loadModule(
    '/src/shared/api/normalize-team-reward-claim.ts',
  )

  const normalized = normalizeTeamRewardClaim({
    signature: '0xsig',
    salt: '0xsalt',
    amount: '1.5',
    signType: '2',
    expireAt: '2024-01-01T00:00:00.000Z',
  })

  assert.equal(normalized.amountWei, 1500000000000000000n)
  assert.equal(normalized.signType, 2n)
  assert.equal(normalized.expireTime, 1704067200n)
})

test('normalizeTeamRewardClaim prefers amount_wei over decimal amount', async () => {
  const { normalizeTeamRewardClaim } = await loadModule(
    '/src/shared/api/normalize-team-reward-claim.ts',
  )

  const normalized = normalizeTeamRewardClaim({
    signature: '0xsig',
    salt: '0xsalt',
    amount: '9.9',
    amount_wei: '1000000000000000000',
    sign_type: '1',
    expire_time: '1735689600',
  })

  assert.equal(normalized.amountWei, 1000000000000000000n)
})

test('normalizeTeamRewardClaim truncates fraction beyond 18 decimals', async () => {
  const { normalizeTeamRewardClaim } = await loadModule(
    '/src/shared/api/normalize-team-reward-claim.ts',
  )

  const normalized = normalizeTeamRewardClaim({
    signature: '0xsig',
    salt: '0xsalt',
    amount: '0.1234567890123456789',
    signType: '1',
    expireTime: '1735689600',
  })

  assert.equal(normalized.amountWei, 123456789012345678n)
})

test('normalizeTeamRewardClaim throws with payload keys when fields missing', async () => {
  const { normalizeTeamRewardClaim } = await loadModule(
    '/src/shared/api/normalize-team-reward-claim.ts',
  )

  assert.throws(
    () => normalizeTeamRewardClaim({ signature: '0xsig' }),
    (error) => {
      assert.ok(error instanceof Error)
      assert.match(error.message, /领取签名缺少字段/)
      assert.match(error.message, /salt/)
      assert.match(error.message, /signature/)
      return true
    },
  )
})
