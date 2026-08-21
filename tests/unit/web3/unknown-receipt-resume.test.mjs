import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ADDR = '0x1111111111111111111111111111111111111111'
const HASH = `0x${'ab'.repeat(32)}`

test('resumeUnknownReceiptLatches unlocks on success and invalidates the write path', async () => {
  const { resumeUnknownReceiptLatches } = await loadModule(
    '/src/web3/wallet/unknown-receipt-resume.ts',
  )
  const {
    WRITE_PATH,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { TAB_QUERY_KEYS } = await loadModule('/src/shared/api/query/tab-query-keys.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('owner'), ADDR, { hash: HASH })
  const exchangeKey = TAB_QUERY_KEYS.exchange[0]
  queryClient.setQueryData(exchangeKey, 1)

  await resumeUnknownReceiptLatches({
    waitForTransactionReceipt: async () => ({ status: 'success', from: ADDR }),
  })

  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), false)
  assert.equal(queryClient.getQueryState(exchangeKey)?.isInvalidated, true)
  queryClient.clear()
  resetUnknownReceiptLocksForTests()
})

test('resumeUnknownReceiptLatches unlocks on revert without invalidating', async () => {
  const { resumeUnknownReceiptLatches } = await loadModule(
    '/src/web3/wallet/unknown-receipt-resume.ts',
  )
  const {
    WRITE_PATH,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')
  const { queryClient } = await loadModule('/src/shared/api/query/query-client.ts')
  const { TAB_QUERY_KEYS } = await loadModule('/src/shared/api/query/tab-query-keys.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('owner'), ADDR, { hash: HASH })
  const exchangeKey = TAB_QUERY_KEYS.exchange[0]
  queryClient.setQueryData(exchangeKey, 1)

  await resumeUnknownReceiptLatches({
    waitForTransactionReceipt: async () => ({ status: 'reverted', from: ADDR }),
  })

  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), false)
  assert.equal(queryClient.getQueryState(exchangeKey)?.isInvalidated, false)
  queryClient.clear()
  resetUnknownReceiptLocksForTests()
})

test('resumeUnknownReceiptLatches does not wait a latch without hash', async () => {
  const { resumeUnknownReceiptLatches } = await loadModule(
    '/src/web3/wallet/unknown-receipt-resume.ts',
  )
  const {
    WRITE_PATH,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('owner'), ADDR)

  let waited = 0
  await resumeUnknownReceiptLatches({
    waitForTransactionReceipt: async () => {
      waited += 1
      return { status: 'success', from: ADDR }
    },
  })

  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), true)
  assert.equal(waited, 0)
  resetUnknownReceiptLocksForTests()
})
