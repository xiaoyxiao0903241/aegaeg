import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('submitLuckyMixedClaim source uses approveThenLiveWrite on pinned round', async () => {
  const { readFile } = await import('node:fs/promises')
  const submitSrc = await readFile(
    new URL('../../../src/views/dapp/rewards/submit-rewards.ts', import.meta.url),
    'utf8',
  )
  assert.match(submitSrc, /approveThenLiveWrite/)
  assert.match(submitSrc, /readLuckyClaimRound/)
  assert.match(submitSrc, /evaluateRewardsMixedClaim/)
  assert.doesNotMatch(submitSrc, /gatePinnedRound/)
})

test('lucky mixed evaluate blocks when live amount or claimable changes', async () => {
  const { evaluateRewardsMixedClaim } = await loadModule(
    '/src/core/rewards/rewards-block-reasons.ts',
  )

  const base = {
    contribution: 1_000n,
    requiredContribution: 10n,
    releasePlanIndex: 0,
    restakePlanIndex: 1,
    luckyPaused: false,
    luckyClaimable: true,
  }

  assert.equal(
    evaluateRewardsMixedClaim({
      ...base,
      amount: 100n,
      rewardAvailable: 100n,
    }),
    null,
  )

  // 实时复核：轮次已不可领
  assert.equal(
    evaluateRewardsMixedClaim({
      ...base,
      amount: 100n,
      rewardAvailable: 100n,
      luckyClaimable: false,
    }),
    'notClaimable',
  )

  // 实时复核：金额变大后贡献不足（按 live 额）
  assert.equal(
    evaluateRewardsMixedClaim({
      ...base,
      amount: 500n,
      rewardAvailable: 500n,
      requiredContribution: 2_000n,
      contribution: 1_000n,
    }),
    'insufficientContribution',
  )
})
