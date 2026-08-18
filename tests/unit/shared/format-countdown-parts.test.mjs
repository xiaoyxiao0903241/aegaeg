import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('formatCountdownParts: units with days + trim drops leading zeros', async () => {
  const { formatCountdownParts } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.deepEqual(formatCountdownParts(3661, ['days', 'hours', 'minutes', 'seconds'], true), [
    { id: 'hours', text: '01' },
    { id: 'minutes', text: '01' },
    { id: 'seconds', text: '01' },
  ])
  assert.deepEqual(formatCountdownParts(61, ['days', 'hours', 'minutes', 'seconds'], true), [
    { id: 'minutes', text: '01' },
    { id: 'seconds', text: '01' },
  ])
})

test('formatCountdownParts: trim=false keeps full ladder', async () => {
  const { formatCountdownParts } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.deepEqual(formatCountdownParts(61, ['days', 'hours', 'minutes', 'seconds'], false), [
    { id: 'days', text: '0' },
    { id: 'hours', text: '00' },
    { id: 'minutes', text: '01' },
    { id: 'seconds', text: '01' },
  ])
  assert.deepEqual(formatCountdownParts(61, ['hours', 'minutes', 'seconds'], false), [
    { id: 'hours', text: '00' },
    { id: 'minutes', text: '01' },
    { id: 'seconds', text: '01' },
  ])
})

test('formatCountdownParts: units without days uses total hours', async () => {
  const { formatCountdownParts } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.deepEqual(formatCountdownParts(90_000, ['hours', 'minutes', 'seconds'], true), [
    { id: 'hours', text: '25' },
    { id: 'minutes', text: '00' },
    { id: 'seconds', text: '00' },
  ])
})

test('formatCountdownParts: units with days keeps non-zero days', async () => {
  const { formatCountdownParts } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.deepEqual(
    formatCountdownParts(86_400 + 3661, ['days', 'hours', 'minutes', 'seconds'], true),
    [
      { id: 'days', text: '1' },
      { id: 'hours', text: '01' },
      { id: 'minutes', text: '01' },
      { id: 'seconds', text: '01' },
    ],
  )
})

test('remainingSecFromBlocks zeros when missing or past', async () => {
  const { remainingSecFromBlocks } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.equal(remainingSecFromBlocks(undefined, 10n), 0)
  assert.equal(remainingSecFromBlocks(10n, 10n), 0)
  assert.equal(remainingSecFromBlocks(5n, 10n), 0)
})

test('remainingSecFromBlocks defaults to 3s/block', async () => {
  const { remainingSecFromBlocks } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.equal(remainingSecFromBlocks(1200n, 0n), 3600)
  assert.equal(remainingSecFromBlocks(101n, 100n), 3)
})

test('remainingSecFromBlocks accepts secondsPerBlock', async () => {
  const { remainingSecFromBlocks } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.equal(remainingSecFromBlocks(1200n, 0n, 2), 2400)
  assert.equal(remainingSecFromBlocks(101n, 100n, 2.5), 2)
})

test('remainingSecFromEpochs: this epoch remainder plus later full epochs', async () => {
  const { remainingSecFromEpochs } = await loadModule('/src/shared/components/countdown-value.tsx')
  // 2 epochs left, 40 blocks this epoch, length 100, 2s/block → 40*2 + 1*100*2 = 280
  assert.equal(remainingSecFromEpochs(2, 140n, 100n, 100n, 2), 280)
  // 1 epoch left → only this epoch remainder
  assert.equal(remainingSecFromEpochs(1, 140n, 100n, 100n, 2), 80)
  // this epoch already at endBlock, 2 epochs still on the number → 1 full epoch
  assert.equal(remainingSecFromEpochs(2, 100n, 100n, 100n, 2), 200)
  assert.equal(remainingSecFromEpochs(0, 140n, 100n, 100n, 2), 0)
})

test('remainingSecFromEpochs: null when chain window is missing', async () => {
  const { remainingSecFromEpochs } = await loadModule('/src/shared/components/countdown-value.tsx')
  assert.equal(remainingSecFromEpochs(2, undefined, 100n, 100n, 2), null)
  assert.equal(remainingSecFromEpochs(2, 140n, 100n, undefined, 2), null)
  assert.equal(remainingSecFromEpochs(null, 140n, 100n, 100n, 2), null)
  // last epoch only needs remaining blocks, not length
  assert.equal(remainingSecFromEpochs(1, 140n, 100n, undefined, 2), 80)
})
