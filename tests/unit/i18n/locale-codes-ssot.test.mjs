import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { loadModule } from '../load-module.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

test('locale-codes matches locales.json SSOT', async () => {
  const fromJson = JSON.parse(readFileSync(resolve(root, 'src/i18n/locales.json'), 'utf8'))
  const { locales, defaultLocale } = await loadModule('/src/i18n/locale-codes.ts')
  assert.deepEqual([...locales], fromJson)
  assert.equal(defaultLocale, 'en')
  assert.ok(locales.includes('th'))
})
