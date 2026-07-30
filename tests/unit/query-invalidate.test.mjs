import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const queryKeysModule = await loadModule('/src/shared/api/query/query-keys.ts')
const { queryKeys } = queryKeysModule

test('query keys normalize addresses and tokens to lowercase', () => {
  const checksummed = '0xA0b86a33E6441E6C7D3D4B4C6f8B9a2D5e7C1F3a'
  const lower = checksummed.toLowerCase()

  assert.deepEqual(queryKeys.chain.referral(checksummed), ['chain', 'referral', lower])
  assert.deepEqual(queryKeys.chain.referralIsBound(checksummed), [
    'chain',
    'referral',
    'isBound',
    lower,
  ])
  assert.deepEqual(queryKeys.chain.presaleUserTotal(checksummed), [
    'chain',
    'presale',
    'userTotal',
    lower,
  ])
  assert.deepEqual(queryKeys.chain.erc20Balance(checksummed, checksummed), [
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
  const userKey = queryKeys.chain.presaleUserTotal(address)
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
  const prevKey = queryKeys.chain.presaleUserTotal(previous)
  const nextKey = queryKeys.chain.presaleUserTotal(next)

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
