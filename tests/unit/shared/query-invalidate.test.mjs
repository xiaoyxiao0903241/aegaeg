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
  assert.deepEqual(queryKeys.chain.erc20Allowance(checksummed, checksummed, checksummed), [
    'chain',
    'erc20',
    'allowance',
    lower,
    lower,
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

test('invalidateAfterStaking source covers staking+assets+lucky (no live poll in unit)', async () => {
  const fs = await import('node:fs/promises')
  const src = await fs.readFile(
    new URL('../../../src/shared/api/query/invalidate.ts', import.meta.url),
    'utf8',
  )
  const body = src.slice(src.indexOf('export function invalidateAfterStaking'))
  assert.match(body, /invalidateTabQueries\('staking'\)/)
  assert.match(body, /invalidateTabQueries\('assets'\)/)
  assert.match(body, /luckyRewardSummary/)
  assert.match(body, /pollStakingIndexer/)
})

test('invalidateAfterAssetsClaim source covers assets+staking+release', async () => {
  const fs = await import('node:fs/promises')
  const src = await fs.readFile(
    new URL('../../../src/shared/api/query/invalidate.ts', import.meta.url),
    'utf8',
  )
  const start = src.indexOf('export function invalidateAfterAssetsClaim')
  const end = src.indexOf('export function invalidateAfterReleaseClaim')
  const body = src.slice(start, end === -1 ? undefined : end)
  assert.match(body, /invalidateTabQueries\('assets'\)/)
  assert.match(body, /invalidateTabQueries\('staking'\)/)
  assert.match(body, /invalidateTabQueries\('release'\)/)
})

test('invalidateAfterRewardsMixedClaim source covers rewards+release+staking', async () => {
  const fs = await import('node:fs/promises')
  const src = await fs.readFile(
    new URL('../../../src/shared/api/query/invalidate.ts', import.meta.url),
    'utf8',
  )
  const start = src.indexOf('export function invalidateAfterRewardsMixedClaim')
  assert.ok(start >= 0, 'invalidateAfterRewardsMixedClaim missing')
  const end = src.indexOf('export function', start + 1)
  const body = src.slice(start, end === -1 ? undefined : end)
  assert.match(body, /invalidateTabQueries\('rewards'\)/)
  assert.match(body, /invalidateTabQueries\('release'\)/)
  assert.match(body, /invalidateTabQueries\('staking'\)/)
})
