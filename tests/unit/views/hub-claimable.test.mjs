import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const SAMPLE = {
  RANK_REWARD: '1.5',
  REFERRAL_REWARD: '2.25',
  PARTICIPATION_REWARD: '1.625522332000000000',
  SURPASS_REWARD: '0.5',
  LIFETIME_REWARD: '9.01',
  LUCKY_REWARD: '3',
  MARKET_FUND: '4.2',
}

test('hubApiClaimableFromTypeTotals maps four API cards; cobuild adds surpass', async () => {
  const { hubApiClaimableFromTypeTotals } = await loadModule(
    '/src/shared/lib/dao-reward-type-totals.ts',
  )

  assert.equal(hubApiClaimableFromTypeTotals('referral', SAMPLE), 2.25)
  assert.equal(hubApiClaimableFromTypeTotals('participate', SAMPLE), 1.625522332)
  assert.equal(hubApiClaimableFromTypeTotals('cobuild', SAMPLE), 2)
  assert.equal(hubApiClaimableFromTypeTotals('grant', SAMPLE), 4.2)
})

test('hubApiClaimableFromTypeTotals: missing totals or field is null; cobuild 0+0 is 0', async () => {
  const { hubApiClaimableFromTypeTotals } = await loadModule(
    '/src/shared/lib/dao-reward-type-totals.ts',
  )

  assert.equal(hubApiClaimableFromTypeTotals('referral', null), null)
  assert.equal(hubApiClaimableFromTypeTotals('referral', { ...SAMPLE, REFERRAL_REWARD: '' }), null)
  assert.equal(
    hubApiClaimableFromTypeTotals('cobuild', { ...SAMPLE, RANK_REWARD: '0', SURPASS_REWARD: '0' }),
    0,
  )
  assert.equal(
    hubApiClaimableFromTypeTotals('cobuild', { ...SAMPLE, RANK_REWARD: '2', SURPASS_REWARD: '' }),
    2,
  )
})

test('typeTotalAmount is one field; cobuild sub-page does not sum', async () => {
  const { typeTotalAmount, hasTypeTotalClaimable } = await loadModule(
    '/src/shared/lib/dao-reward-type-totals.ts',
  )

  assert.equal(typeTotalAmount(SAMPLE, 'RANK_REWARD'), 1.5)
  assert.equal(typeTotalAmount(SAMPLE, 'SURPASS_REWARD'), 0.5)
  assert.equal(typeTotalAmount(null, 'REFERRAL_REWARD'), null)
  assert.equal(hasTypeTotalClaimable(null), false)
  assert.equal(hasTypeTotalClaimable(0), false)
  assert.equal(hasTypeTotalClaimable(0.0001), true)
})

test('rewards rail lucky probe is not gated to the rewards tab', () => {
  const nav = readFileSync(
    new URL('../../../src/hooks/use-nav-claimable-dots.ts', import.meta.url),
    'utf8',
  )

  assert.match(nav, /readLuckyClaimSnapshot/)
  assert.match(nav, /useDaoRewardTypeTotals/)
  assert.match(nav, /rewards\.referral/)
  assert.match(nav, /rewards\.participate/)
  assert.match(nav, /rewards\.cobuild/)
  assert.match(nav, /useUserNodeType/)
  assert.match(nav, /isGrantNodeEligible/)
  assert.match(nav, /enabled: walletReady/)
  assert.doesNotMatch(nav, /enabled: walletReady && onRewards/)
  assert.doesNotMatch(nav, /!walletReady \|\| !onRewards/)
  assert.doesNotMatch(nav, /无预览可领额/)
})

test('rewards hub hides grant card unless node type is eligible', () => {
  const dock = readFileSync(
    new URL('../../../src/views/dapp/rewards/hub/dock.tsx', import.meta.url),
    'utf8',
  )
  assert.match(dock, /useUserNodeType/)
  assert.match(dock, /isGrantNodeEligible/)
  assert.match(dock, /view === 'grant' && !grantEligible/)
})

test('claimable dots poll every balances interval', () => {
  const nav = readFileSync(
    new URL('../../../src/hooks/use-nav-claimable-dots.ts', import.meta.url),
    'utf8',
  )
  const typeTotals = readFileSync(
    new URL('../../../src/hooks/api/rewards.ts', import.meta.url),
    'utf8',
  )
  const team = readFileSync(new URL('../../../src/hooks/api/community.ts', import.meta.url), 'utf8')
  const auth = readFileSync(
    new URL('../../../src/hooks/api/_authenticated-query.ts', import.meta.url),
    'utf8',
  )

  assert.match(auth, /staleTime: options\?\.staleTime \?\? QUERY_STALE_TIME\.api/)
  assert.match(auth, /refetchInterval: options\?\.refetchInterval/)
  assert.match(typeTotals, /useDaoRewardTypeTotals[\s\S]*staleTime: QUERY_STALE_TIME\.balances/)
  assert.match(
    typeTotals,
    /useDaoRewardTypeTotals[\s\S]*refetchInterval: QUERY_STALE_TIME\.balances/,
  )
  assert.match(team, /useTeamRewardTotal[\s\S]*staleTime: QUERY_STALE_TIME\.balances/)
  assert.match(team, /useTeamRewardTotal[\s\S]*refetchInterval: QUERY_STALE_TIME\.balances/)
  assert.match(nav, /const CLAIMABLE_DOT_POLL_MS = QUERY_STALE_TIME\.balances/)
  assert.equal((nav.match(/refetchInterval: CLAIMABLE_DOT_POLL_MS/g) ?? []).length, 8)
})

test('assets rail expiry probe is not gated to the assets tab', () => {
  const nav = readFileSync(
    new URL('../../../src/hooks/use-nav-claimable-dots.ts', import.meta.url),
    'utf8',
  )
  const dock = readFileSync(
    new URL('../../../src/views/dapp/assets/hub/dock.tsx', import.meta.url),
    'utf8',
  )
  const rail = readFileSync(
    new URL('../../../src/views/dapp/host/rail.tsx', import.meta.url),
    'utf8',
  )

  assert.match(nav, /readStakePositions/)
  assert.match(nav, /readLpBondPositions/)
  assert.match(nav, /readBurnBondPositions/)
  assert.match(nav, /readXminePosition/)
  assert.match(nav, /fingerprintAssetsStakeExpiry/)
  assert.match(nav, /assets\.stake/)
  assert.match(nav, /assets\.lpbond/)
  assert.match(nav, /assets\.burnbond/)
  assert.match(nav, /assets\.xmine/)
  assert.doesNotMatch(nav, /enabled: walletReady && onAssets/)
  assert.match(dock, /dots\[key\]/)
  assert.match(rail, /item\.id === 'assets' && assetsClaimable/)
})

test('hub lucky stays on chain; four API cards use type-totals; genesis stays team-reward', () => {
  const dock = readFileSync(
    new URL('../../../src/views/dapp/rewards/hub/dock.tsx', import.meta.url),
    'utf8',
  )
  const mixed = readFileSync(
    new URL('../../../src/views/dapp/rewards/use-mixed-claim.ts', import.meta.url),
    'utf8',
  )
  const grant = readFileSync(
    new URL('../../../src/views/dapp/rewards/use-simple-claim.ts', import.meta.url),
    'utf8',
  )
  const genesis = readFileSync(
    new URL('../../../src/views/dapp/rewards/genesis/use-genesis.ts', import.meta.url),
    'utf8',
  )
  const endpoint = readFileSync(
    new URL('../../../src/shared/api/endpoints/rewards.ts', import.meta.url),
    'utf8',
  )

  assert.match(dock, /readLuckyClaimSnapshot/)
  assert.match(dock, /useTeamRewardTotal/)
  assert.match(dock, /hubApiClaimableFromTypeTotals/)
  assert.match(dock, /useDaoRewardTypeTotals/)
  assert.match(dock, /dots\[view\]/)
  assert.match(endpoint, /\/dao-reward\/type-totals/)
  assert.match(mixed, /typeTotalAmount/)
  assert.match(mixed, /allowUnknownAmount: isDaoMixed && hasClaimablePreview/)
  assert.doesNotMatch(mixed, /LUCKY_REWARD/)
  assert.match(grant, /MARKET_FUND/)
  assert.doesNotMatch(genesis, /useDaoRewardTypeTotals/)
  assert.doesNotMatch(genesis, /LIFETIME_REWARD/)
})
