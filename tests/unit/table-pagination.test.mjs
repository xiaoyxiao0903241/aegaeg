import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('tablePageQuery uses DApp table page size', async () => {
  const { DAPP_TABLE_PAGE_SIZE, tablePageQuery } = await loadModule(
    '/src/lib/table-pagination.ts',
  )

  assert.deepEqual(tablePageQuery(2), { page: 2, page_size: DAPP_TABLE_PAGE_SIZE })
})

test('shouldShowTablePagination hides pagination when total fits one page', async () => {
  const { DAPP_TABLE_PAGE_SIZE, shouldShowTablePagination } = await loadModule(
    '/src/lib/table-pagination.ts',
  )

  assert.equal(shouldShowTablePagination(0), false)
  assert.equal(shouldShowTablePagination(5), false)
  assert.equal(shouldShowTablePagination(DAPP_TABLE_PAGE_SIZE), false)
  assert.equal(shouldShowTablePagination(6), true)
  assert.equal(shouldShowTablePagination(12), true)
})

test('dappTableViewState derives auth gate, empty query, and skeleton flags', async () => {
  const { dappTableViewState } = await loadModule('/src/lib/table-pagination.ts')

  assert.deepEqual(
    dappTableViewState({
      sessionReady: false,
      isLoggingIn: false,
      isLoading: false,
      rowCount: 0,
    }),
    {
      requiresAuth: true,
      queryEmpty: false,
      showSkeleton: false,
    },
  )

  assert.deepEqual(
    dappTableViewState({
      sessionReady: false,
      isLoggingIn: true,
      isLoading: false,
      rowCount: 0,
    }),
    {
      requiresAuth: false,
      queryEmpty: false,
      showSkeleton: false,
    },
  )

  assert.deepEqual(
    dappTableViewState({
      sessionReady: true,
      isLoggingIn: false,
      isLoading: true,
      rowCount: 0,
    }),
    {
      requiresAuth: false,
      queryEmpty: false,
      showSkeleton: true,
    },
  )

  assert.deepEqual(
    dappTableViewState({
      sessionReady: true,
      isLoggingIn: false,
      isLoading: false,
      rowCount: 0,
    }),
    {
      requiresAuth: false,
      queryEmpty: true,
      showSkeleton: false,
    },
  )
})
