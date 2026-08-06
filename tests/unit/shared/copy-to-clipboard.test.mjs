import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('copyTextToClipboard returns failed for empty text', async () => {
  const { copyTextToClipboard } = await loadModule('/src/shared/lib/copy-to-clipboard.ts')
  assert.equal(await copyTextToClipboard(''), 'failed')
})

test('copyTextToClipboard returns skipped within cooldown for same text', async () => {
  const mod = await loadModule('/src/shared/lib/copy-to-clipboard.ts')
  const { copyTextToClipboard } = mod

  const originalClipboard = navigator.clipboard
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async () => {},
    },
  })

  try {
    assert.equal(await copyTextToClipboard('hello-aegis'), 'copied')
    assert.equal(await copyTextToClipboard('hello-aegis'), 'skipped')
  } finally {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    })
  }
})
