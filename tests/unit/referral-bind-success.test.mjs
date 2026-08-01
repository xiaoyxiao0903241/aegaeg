import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('readAndClearBindSuccess reports envelope onSuccess once', async () => {
  const { readAndClearBindSuccess } = await loadModule(
    '/src/views/dapp/community/referral-bind-success.ts',
  )

  const flag = { current: false }
  assert.equal(readAndClearBindSuccess(flag), false)

  flag.current = true
  assert.equal(readAndClearBindSuccess(flag), true)
  assert.equal(flag.current, false)
  assert.equal(readAndClearBindSuccess(flag), false)
})
