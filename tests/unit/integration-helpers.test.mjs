import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildSeasonOptions marks active phase from chain timestamps', async () => {
  const { buildSeasonOptions } = await loadModule('/src/lib/presale/season-options.ts')
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
      purchasedAmount: 500n,
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
      purchasedAmount: 0n,
    },
  ]

  const seasons = buildSeasonOptions(phases, 55, now)
  assert.equal(seasons[0]?.active, true)
  assert.equal(seasons[0]?.status, 'LIVE')
  assert.equal(seasons[1]?.status, 'Upcoming')
})

test('normalizeTeamRewardClaimPayload accepts snake_case fields', async () => {
  const { normalizeTeamRewardClaimPayload } = await loadModule(
    '/src/lib/api/normalize-claim-payload.ts',
  )

  const normalized = normalizeTeamRewardClaimPayload({
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
