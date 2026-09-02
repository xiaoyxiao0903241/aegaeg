import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const queryKeysModule = await loadModule('/src/shared/api/query/query-keys.ts')
const { queryKeys } = queryKeysModule

test('query keys normalize addresses and tokens to lowercase', () => {
  const checksummed = '0xA0b86a33E6441E6C7D3D4B4C6f8B9a2D5e7C1F3a'
  const lower = checksummed.toLowerCase()

  assert.deepEqual(queryKeys.chain.referral, ['chain', 'referral'])
  assert.deepEqual(queryKeys.chain.referralOf(checksummed), ['chain', 'referral', lower])
  assert.deepEqual(queryKeys.chain.referralIsBoundOf(checksummed), [
    'chain',
    'referral',
    'isBound',
    lower,
  ])
  assert.deepEqual(queryKeys.chain.presaleUserTotal, ['chain', 'presale', 'userTotal'])
  assert.deepEqual(queryKeys.chain.presaleUserTotalOf(checksummed), [
    'chain',
    'presale',
    'userTotal',
    lower,
  ])
  assert.deepEqual(queryKeys.chain.erc20Balance(checksummed), ['chain', 'erc20', 'balance', lower])
  assert.deepEqual(queryKeys.chain.erc20BalanceOf(checksummed, checksummed), [
    'chain',
    'erc20',
    'balance',
    lower,
    lower,
  ])
  assert.deepEqual(queryKeys.chain.erc20Allowance(checksummed, checksummed), [
    'chain',
    'erc20',
    'allowance',
    lower,
    lower,
  ])
  assert.deepEqual(queryKeys.chain.erc20AllowanceOf(checksummed, checksummed, checksummed), [
    'chain',
    'erc20',
    'allowance',
    lower,
    lower,
    lower,
  ])
  assert.deepEqual(queryKeys.chain.presaleUserPhaseRemaining(1), [
    'chain',
    'presale',
    'userPhaseRemaining',
    1,
  ])
  assert.deepEqual(queryKeys.chain.presaleUserPhaseRemainingOf(checksummed, 1), [
    'chain',
    'presale',
    'userPhaseRemaining',
    1,
    lower,
  ])
  assert.deepEqual(queryKeys.chain.swapQuote(checksummed, checksummed, '1000'), [
    'chain',
    'swap',
    'quote',
    lower,
    lower,
    '1000',
  ])
})

test('invalidateAfterGenesisPurchase optimistically adds purchaseAmount', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterGenesisPurchase } = await loadModule('/src/shared/api/query/invalidate.ts')

  const address = '0xabc'
  const userKey = queryKeys.chain.presaleUserTotalOf(address)
  const totalKey = queryKeys.chain.presaleTotalPurchased

  queryClient.setQueryData(userKey, 100n)
  queryClient.setQueryData(totalKey, 1000n)

  invalidateAfterGenesisPurchase(address, 50n)

  assert.equal(queryClient.getQueryData(userKey), 150n)
  assert.equal(queryClient.getQueryData(totalKey), 1050n)

  queryClient.clear()
})

test('invalidateAfterWalletSwitch dirties only next address phase remaining', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterWalletSwitch } = await loadModule('/src/shared/api/query/invalidate.ts')

  const previous = '0xaaa'
  const next = '0xbbb'
  const prevKey = queryKeys.chain.presaleUserPhaseRemainingOf(previous, 1)
  const nextKey = queryKeys.chain.presaleUserPhaseRemainingOf(next, 1)

  queryClient.setQueryData(prevKey, 10n)
  queryClient.setQueryData(nextKey, 20n)

  invalidateAfterWalletSwitch(next)

  assert.equal(queryClient.getQueryState(prevKey)?.isInvalidated ?? false, false)
  assert.equal(queryClient.getQueryState(nextKey)?.isInvalidated, true)

  queryClient.clear()
})

test('invalidateAfterWalletSwitch refreshes next address chain queries', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterWalletSwitch } = await loadModule('/src/shared/api/query/invalidate.ts')

  const previous = '0xaaa'
  const next = '0xbbb'
  const prevKey = queryKeys.chain.presaleUserTotalOf(previous)
  const nextKey = queryKeys.chain.presaleUserTotalOf(next)

  queryClient.setQueryData(prevKey, 10n)
  queryClient.setQueryData(nextKey, 20n)

  // Mark both fresh then invalidate switch — previous cache value must remain.
  invalidateAfterWalletSwitch(next)

  assert.equal(queryClient.getQueryData(prevKey), 10n)
  assert.equal(queryClient.getQueryData(nextKey), 20n)

  const prevState = queryClient.getQueryState(prevKey)
  const nextState = queryClient.getQueryState(nextKey)
  // Next address queries are invalidated (stale); previous is untouched.
  assert.ok(nextState?.isInvalidated === true || nextState?.isInvalidated === undefined)
  assert.equal(prevState?.isInvalidated ?? false, false)

  queryClient.clear()
})

test('canRunAuthenticatedQuery requires hydrate + session + token', async () => {
  const { canRunAuthenticatedQuery } = await loadModule('/src/shared/api/query/session-request.ts')

  assert.equal(
    canRunAuthenticatedQuery({
      enabled: true,
      hasHydrated: true,
      sessionReady: true,
      hasToken: true,
    }),
    true,
  )
  assert.equal(
    canRunAuthenticatedQuery({
      enabled: true,
      hasHydrated: false,
      sessionReady: true,
      hasToken: true,
    }),
    false,
  )
  assert.equal(
    canRunAuthenticatedQuery({
      enabled: true,
      hasHydrated: true,
      sessionReady: false,
      hasToken: true,
    }),
    false,
  )
  assert.equal(
    canRunAuthenticatedQuery({
      enabled: true,
      hasHydrated: true,
      sessionReady: true,
      hasToken: false,
    }),
    false,
  )
  assert.equal(
    canRunAuthenticatedQuery({
      enabled: false,
      hasHydrated: true,
      sessionReady: true,
      hasToken: true,
    }),
    false,
  )
})

test('salesLogAdvanced detects new purchase by total or first id', async () => {
  const { salesLogAdvanced, pickSalesLogFingerprint } = await loadModule(
    '/src/shared/api/query/invalidate.ts',
  )

  assert.equal(salesLogAdvanced({ total: 20, firstId: 1 }, { total: 21, firstId: 99 }), true)
  assert.equal(salesLogAdvanced({ total: 20, firstId: 1 }, { total: 20, firstId: 99 }), true)
  assert.equal(salesLogAdvanced({ total: 20, firstId: 1 }, { total: 20, firstId: 1 }), false)

  const fingerprint = pickSalesLogFingerprint([
    { total: 20, page: 1, page_size: 20, items: [{ id: 5 }] },
    { total: 20, page: 1, page_size: 20, items: [] },
  ])
  assert.equal(fingerprint.total, 20)
  assert.equal(fingerprint.firstId, 5)
})

test('indexerPageAdvanced mirrors sales-log advance rules on tx_hash head', async () => {
  const { indexerPageAdvanced, pickIndexerPageFingerprint } = await loadModule(
    '/src/shared/api/query/invalidate.ts',
  )

  assert.equal(indexerPageAdvanced({ total: 2, head: '0xa' }, { total: 3, head: '0xb' }), true)
  assert.equal(indexerPageAdvanced({ total: 2, head: '0xa' }, { total: 2, head: '0xb' }), true)
  assert.equal(indexerPageAdvanced({ total: 2, head: '0xa' }, { total: 2, head: '0xa' }), false)

  const fingerprint = pickIndexerPageFingerprint([
    { total: 4, items: [{ tx_hash: '0xabc' }] },
    { total: 4, items: [] },
  ])
  assert.equal(fingerprint.total, 4)
  assert.equal(fingerprint.head, '0xabc')
})

test('reward status fingerprint advances on READY→CLAIMED without new rows', async () => {
  const { pickRewardStatusPageFingerprint, rewardScanAdvanced } = await loadModule(
    '/src/shared/api/query/invalidate.ts',
  )

  const ready = pickRewardStatusPageFingerprint([
    {
      total: 2,
      page: 1,
      page_size: 20,
      items: [{ status: 'READY', fully_claimed_at: null }],
    },
  ])
  const claimed = pickRewardStatusPageFingerprint([
    {
      total: 2,
      page: 1,
      page_size: 20,
      items: [{ status: 'CLAIMED', fully_claimed_at: '2026-01-01T00:00:00Z' }],
    },
  ])
  assert.equal(ready, '2:READY|||')
  assert.equal(claimed, '2:CLAIMED|2026-01-01T00:00:00Z||')
  assert.notEqual(ready, claimed)

  const empty = {
    typeTotals: '',
    grantLogs: '0:',
    luckyLogs: '0:',
    luckySummary: '',
    teamLogs: '0:',
    teamTotal: '',
    marketLogs: '0:',
    marketSummary: '',
    communityLogs: '0:',
    communityTotal: '',
    assetsReward: '',
  }
  assert.equal(rewardScanAdvanced(empty, empty), false)
  assert.equal(
    rewardScanAdvanced({ ...empty, grantLogs: ready }, { ...empty, grantLogs: claimed }),
    true,
  )
  assert.equal(
    rewardScanAdvanced({ ...empty, typeTotals: '1|0' }, { ...empty, typeTotals: '0|0' }),
    true,
  )
})

async function seedTabProbe(tab) {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { TAB_QUERY_KEYS } = await loadModule('/src/shared/api/query/tab-query-keys.ts')
  const key = TAB_QUERY_KEYS[tab][0]
  queryClient.setQueryData(key, 1)
  return { queryClient, key }
}

function assertInvalidated(queryClient, key) {
  assert.equal(queryClient.getQueryState(key)?.isInvalidated, true)
}

test('invalidateAfterAssetsClaim marks assets+staking+release and contribution', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterAssetsClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  const assets = await seedTabProbe('assets')
  const staking = await seedTabProbe('staking')
  const release = await seedTabProbe('release')
  queryClient.setQueryData(queryKeys.api.agxContributionSummary, 1)
  queryClient.setQueryData(queryKeys.api.agxContributionConsumeLogsRoot, 1)

  invalidateAfterAssetsClaim()

  assertInvalidated(assets.queryClient, assets.key)
  assertInvalidated(staking.queryClient, staking.key)
  assertInvalidated(release.queryClient, release.key)
  assertInvalidated(queryClient, queryKeys.api.agxContributionSummary)
  assertInvalidated(queryClient, queryKeys.api.agxContributionConsumeLogsRoot)
  assets.queryClient.clear()
})

test('invalidateAfterRewardsMixedClaim marks rewards+release+staking+assets', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterRewardsMixedClaim } = await loadModule(
    '/src/shared/api/query/invalidate.ts',
  )
  const rewards = await seedTabProbe('rewards')
  const release = await seedTabProbe('release')
  const staking = await seedTabProbe('staking')
  queryClient.setQueryData(queryKeys.api.assetsRewardSummary, 1)
  queryClient.setQueryData(queryKeys.api.assetsHoldingsSummary, 1)
  queryClient.setQueryData(queryKeys.api.assetsHoldingsDistribution, 1)
  queryClient.setQueryData(queryKeys.api.assetsProductInvestReward, 1)
  queryClient.setQueryData(queryKeys.api.agxContributionConsumeLogsRoot, 1)

  invalidateAfterRewardsMixedClaim()

  assertInvalidated(rewards.queryClient, rewards.key)
  assertInvalidated(release.queryClient, release.key)
  assertInvalidated(staking.queryClient, staking.key)
  assertInvalidated(queryClient, queryKeys.api.assetsRewardSummary)
  assertInvalidated(queryClient, queryKeys.api.assetsHoldingsSummary)
  assertInvalidated(queryClient, queryKeys.api.assetsHoldingsDistribution)
  assertInvalidated(queryClient, queryKeys.api.assetsProductInvestReward)
  assertInvalidated(queryClient, queryKeys.api.agxContributionConsumeLogsRoot)
  rewards.queryClient.clear()
})

test('invalidateAfterTeamClaim marks rewards+assets', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterTeamClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  const rewards = await seedTabProbe('rewards')
  queryClient.setQueryData(queryKeys.api.assetsRewardSummary, 1)

  invalidateAfterTeamClaim()

  assertInvalidated(rewards.queryClient, rewards.key)
  assertInvalidated(queryClient, queryKeys.api.assetsRewardSummary)
  rewards.queryClient.clear()
})

test('invalidateAfterReleaseClaim marks release+assets reward summary', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterReleaseClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  const release = await seedTabProbe('release')
  queryClient.setQueryData(queryKeys.api.assetsRewardSummary, 1)

  invalidateAfterReleaseClaim()

  assertInvalidated(release.queryClient, release.key)
  assertInvalidated(queryClient, queryKeys.api.assetsRewardSummary)
  release.queryClient.clear()
})

test('invalidateAfterExchange marks assets reward summary, not contribution', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  queryClient.setQueryData(queryKeys.api.assetsRewardSummary, 1)
  queryClient.setQueryData(queryKeys.api.agxContributionSummary, 1)
  queryClient.setQueryData(queryKeys.api.assetsHoldingsSummary, 1)
  queryClient.setQueryData(queryKeys.api.assetsHoldingsDistribution, 1)

  invalidateAfterExchange()

  assertInvalidated(queryClient, queryKeys.api.assetsRewardSummary)
  assertInvalidated(queryClient, queryKeys.api.assetsHoldingsSummary)
  assertInvalidated(queryClient, queryKeys.api.assetsHoldingsDistribution)
  assert.equal(
    queryClient.getQueryState(queryKeys.api.agxContributionSummary)?.isInvalidated,
    false,
  )
  queryClient.clear()
})

test('invalidateAfterStaking marks making overview APIs', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterStaking } = await loadModule('/src/shared/api/query/invalidate.ts')
  queryClient.setQueryData(queryKeys.api.performance, 1)
  queryClient.setQueryData(queryKeys.api.makingOverview, 1)
  queryClient.setQueryData(queryKeys.api.teamMakingOverview, 1)

  invalidateAfterStaking()

  assertInvalidated(queryClient, queryKeys.api.performance)
  assertInvalidated(queryClient, queryKeys.api.makingOverview)
  assertInvalidated(queryClient, queryKeys.api.teamMakingOverview)
  queryClient.clear()
})

test('invalidateAfterBurnExchange marks contribution and assets reward summary', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterBurnExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  queryClient.setQueryData(queryKeys.api.assetsRewardSummary, 1)
  queryClient.setQueryData(queryKeys.api.agxContributionSummary, 1)

  invalidateAfterBurnExchange()

  assertInvalidated(queryClient, queryKeys.api.assetsRewardSummary)
  assertInvalidated(queryClient, queryKeys.api.agxContributionSummary)
  queryClient.clear()
})

const stalePage = { total: 1, items: [{ tx_hash: '0xold' }] }

async function seedFetchablePage(queryClient, rootKey) {
  const { QueryObserver } = await loadModule('@tanstack/react-query')
  const queryKey = [...rootKey, 1, 5, null]
  const queryFn = async () => stalePage
  const observer = new QueryObserver(queryClient, { queryKey, queryFn })
  const unsubscribe = observer.subscribe(() => {})
  await queryClient.prefetchQuery({ queryKey, queryFn })
  return unsubscribe
}

function countPrefixRefetches(queryClient, rootKey) {
  const orig = queryClient.refetchQueries.bind(queryClient)
  let count = 0
  queryClient.refetchQueries = (opts) => {
    const key = opts?.queryKey
    if (
      Array.isArray(key) &&
      rootKey.length <= key.length &&
      rootKey.every((part, index) => key[index] === part)
    ) {
      count += 1
    }
    return orig(opts)
  }
  return {
    countOf: () => count,
    restore: () => {
      queryClient.refetchQueries = orig
    },
  }
}

async function assertLogsPollAfter(run, rootKey) {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const unsubscribe = await seedFetchablePage(queryClient, rootKey)
  const spy = countPrefixRefetches(queryClient, rootKey)
  try {
    run()
    await new Promise((resolve) => setTimeout(resolve, 50))
    // invalidateQueries 自带一次 active refetch；短窗 poll 第一轮再拉一次
    assert.ok(spy.countOf() >= 2, `expected logs poll refetch of ${rootKey.join('/')}`)
  } finally {
    unsubscribe()
    spy.restore()
    queryClient.clear()
  }
}

test('invalidateAfterAssetsClaim polls stake-flow logs', async () => {
  const { invalidateAfterAssetsClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertLogsPollAfter(() => invalidateAfterAssetsClaim(), queryKeys.api.stakeFlowLogsRoot)
})

test('invalidateAfterReleaseClaim polls release-pool logs', async () => {
  const { invalidateAfterReleaseClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertLogsPollAfter(() => invalidateAfterReleaseClaim(), queryKeys.api.releasePoolLogsRoot)
})

test('invalidateAfterExchange polls turbine logs', async () => {
  const { invalidateAfterExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertLogsPollAfter(() => invalidateAfterExchange(), queryKeys.api.turbineLogsRoot)
})

test('invalidateAfterBurnExchange polls contribution burn logs', async () => {
  const { invalidateAfterBurnExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertLogsPollAfter(
    () => invalidateAfterBurnExchange(),
    queryKeys.api.agxContributionBurnLogsRoot,
  )
})

test('invalidateAfterExchange skips logs poll when no log query is mounted', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  const spy = countPrefixRefetches(queryClient, queryKeys.api.turbineLogsRoot)
  try {
    invalidateAfterExchange()
    await new Promise((resolve) => setTimeout(resolve, 50))
    assert.equal(spy.countOf(), 1)
  } finally {
    spy.restore()
    queryClient.clear()
  }
})

async function seedFetchableExact(queryClient, queryKey, data = { ok: true }) {
  const { QueryObserver } = await loadModule('@tanstack/react-query')
  const queryFn = async () => data
  const observer = new QueryObserver(queryClient, { queryKey, queryFn })
  const unsubscribe = observer.subscribe(() => {})
  await queryClient.prefetchQuery({ queryKey, queryFn })
  return unsubscribe
}

async function assertExtraKeyPollAfter(run, logRoot, extraKey) {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const unsubLog = await seedFetchablePage(queryClient, logRoot)
  const unsubExtra = await seedFetchableExact(queryClient, extraKey)
  const spy = countPrefixRefetches(queryClient, extraKey)
  try {
    run()
    await new Promise((resolve) => setTimeout(resolve, 50))
    assert.ok(spy.countOf() >= 2, `expected extraKey poll of ${extraKey.join('/')}`)
  } finally {
    unsubLog()
    unsubExtra()
    spy.restore()
    queryClient.clear()
  }
}

test('invalidateAfterAssetsClaim polls x0-mining summary extraKeys when logs are mounted', async () => {
  const { invalidateAfterAssetsClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertExtraKeyPollAfter(
    () => invalidateAfterAssetsClaim(),
    queryKeys.api.x0MiningLogsRoot,
    queryKeys.api.x0MiningSummary,
  )
})

test('invalidateAfterAssetsClaim polls contribution consume logs', async () => {
  const { invalidateAfterAssetsClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertLogsPollAfter(
    () => invalidateAfterAssetsClaim(),
    queryKeys.api.agxContributionConsumeLogsRoot,
  )
})

test('invalidateAfterRewardsMixedClaim polls contribution consume logs', async () => {
  const { invalidateAfterRewardsMixedClaim } = await loadModule(
    '/src/shared/api/query/invalidate.ts',
  )
  await assertLogsPollAfter(
    () => invalidateAfterRewardsMixedClaim(),
    queryKeys.api.agxContributionConsumeLogsRoot,
  )
})

test('invalidateAfterExchange polls holdings extraKeys when logs are mounted', async () => {
  const { invalidateAfterExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertExtraKeyPollAfter(
    () => invalidateAfterExchange(),
    queryKeys.api.turbineLogsRoot,
    queryKeys.api.assetsHoldingsSummary,
  )
})

test('invalidateAfterExchange does not poll holdings when no logs are mounted', async () => {
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { invalidateAfterExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  const unsubscribe = await seedFetchableExact(queryClient, queryKeys.api.assetsHoldingsSummary)
  const spy = countPrefixRefetches(queryClient, queryKeys.api.assetsHoldingsSummary)
  try {
    invalidateAfterExchange()
    await new Promise((resolve) => setTimeout(resolve, 50))
    assert.equal(spy.countOf(), 1)
  } finally {
    unsubscribe()
    spy.restore()
    queryClient.clear()
  }
})

test('invalidateAfterReleaseClaim polls release summary extraKeys when logs are mounted', async () => {
  const { invalidateAfterReleaseClaim } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertExtraKeyPollAfter(
    () => invalidateAfterReleaseClaim(),
    queryKeys.api.releasePoolLogsRoot,
    queryKeys.api.releasePoolSummary,
  )
})

test('invalidateAfterExchange polls turbine summary extraKeys when logs are mounted', async () => {
  const { invalidateAfterExchange } = await loadModule('/src/shared/api/query/invalidate.ts')
  await assertExtraKeyPollAfter(
    () => invalidateAfterExchange(),
    queryKeys.api.turbineLogsRoot,
    queryKeys.api.turbineSummary,
  )
})
