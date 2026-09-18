import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('formatFromNow: missing unix is em dash', async () => {
  const { formatFromNow } = await loadModule('/src/shared/presenters/format.ts')
  assert.equal(formatFromNow(0, 1_000, 'zh-CN'), '—')
})

test('formatFromNow: follows Intl locale', async () => {
  const { formatFromNow } = await loadModule('/src/shared/presenters/format.ts')
  const now = 1_700_000_000
  assert.equal(formatFromNow(now, now, 'zh-CN'), '现在')
  assert.equal(formatFromNow(now, now, 'en'), 'now')
  assert.equal(formatFromNow(now - 30, now, 'zh-CN'), '30秒钟前')
  assert.equal(formatFromNow(now - 3 * 3600, now, 'en'), '3 hours ago')
  assert.equal(formatFromNow(now - 86_400, now, 'zh-Hant'), '昨天')
})

test('formatFromNow: milliseconds unix is treated as ms', async () => {
  const { formatFromNow } = await loadModule('/src/shared/presenters/format.ts')
  const sec = 1_700_000_000
  assert.equal(formatFromNow(sec * 1000 - 3 * 3600 * 1000, sec, 'en'), '3 hours ago')
})
