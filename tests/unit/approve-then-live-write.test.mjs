import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('approveThenLiveWrite runs pre → approve → live → write in order', async () => {
  const { approveThenLiveWrite } = await loadModule('/src/web3/wallet/approve-then-live-write.ts')

  const steps = []
  let reads = 0
  await approveThenLiveWrite({
    readSnapshot: async () => {
      reads += 1
      steps.push(`read${reads}`)
      return { ok: true }
    },
    evaluate: () => null,
    mapBlockError: (reason) => reason,
    approve: async () => {
      steps.push('approve')
    },
    write: async () => {
      steps.push('write')
    },
  })

  assert.deepEqual(steps, ['read1', 'approve', 'read2', 'write'])
})

test('approveThenLiveWrite throws mapped pre gate and skips approve', async () => {
  const { approveThenLiveWrite } = await loadModule('/src/web3/wallet/approve-then-live-write.ts')

  let approved = false
  await assert.rejects(
    () =>
      approveThenLiveWrite({
        readSnapshot: async () => ({ n: 1 }),
        evaluate: () => 'blocked',
        mapBlockError: (reason) => `ERR_${reason}`,
        approve: async () => {
          approved = true
        },
        write: async () => {},
      }),
    (err) => err === 'ERR_blocked',
  )
  assert.equal(approved, false)
})

test('approveThenLiveWrite soft-fails on live gate after approve', async () => {
  const { approveThenLiveWrite } = await loadModule('/src/web3/wallet/approve-then-live-write.ts')

  let reads = 0
  let wrote = false
  await assert.rejects(
    () =>
      approveThenLiveWrite({
        readSnapshot: async () => {
          reads += 1
          return { reads }
        },
        evaluate: (snap) => (snap.reads === 2 ? 'liveFail' : null),
        mapBlockError: (reason) => reason,
        approve: async () => {},
        write: async () => {
          wrote = true
        },
      }),
    (err) => err === 'liveFail',
  )
  assert.equal(wrote, false)
  assert.equal(reads, 2)
})
