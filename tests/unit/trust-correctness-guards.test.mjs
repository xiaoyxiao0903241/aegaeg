import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('theme.css defines --claim-restake from tokens SSOT (restake blue, not success)', async () => {
  const css = await readFile(
    new URL('../../src/shared/styles/tokens/theme.css', import.meta.url),
    'utf8',
  )
  assert.match(css, /--claim-restake:\s*#4a7bec/)
  assert.match(css, /--app-claim-restake:\s*var\(--claim-restake\)/)
})

test('home metrics X supply value matches countTarget+suffix', async () => {
  const locales = ['en', 'zh', 'zht', 'ja', 'ko', 'ru', 'vi', 'th', 'tr', 'id', 'hi', 'es']
  for (const locale of locales) {
    const mod = await loadModule(`/src/i18n/messages/home/${locale}.ts`)
    const bundle = mod.default
    assert.ok(bundle?.metrics, `missing metrics in ${locale}`)
    const xSupply = bundle.metrics.find((m) => m.suffix === 'M' && String(m.value).includes('2.1'))
    assert.ok(xSupply, `missing 2.1M metric in ${locale}`)
    assert.equal(xSupply.countTarget, 2.1, locale)
    assert.equal(xSupply.value, `2.1${xSupply.suffix}`, locale)
  }
})
