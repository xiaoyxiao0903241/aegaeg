import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { injectViewportUnitFallbacks } from '../../vite-plugins/viewport-unit-fallbacks.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

test('injectViewportUnitFallbacks: prefixes vh before dvh on the same property', () => {
  const out = injectViewportUnitFallbacks(
    'html.dapp-app,html.dapp-app body,html.dapp-app #root{height:100dvh;max-height:100dvh;overflow:hidden}',
  )

  assert.equal(
    out,
    'html.dapp-app,html.dapp-app body,html.dapp-app #root{height:100vh;height:100dvh;max-height:100vh;max-height:100dvh;overflow:hidden}',
  )
})

test('injectViewportUnitFallbacks: rewrites compound values and Tailwind utilities', () => {
  const out = injectViewportUnitFallbacks(
    [
      '.h-dvh{height:100dvh}',
      '.x{max-height:min(92dvh,100dvh - 2rem)}',
      '.y{max-block-size:min(68svh,35rem)}',
      '.z{width:100dvw}',
    ].join(''),
  )

  assert.match(out, /\.h-dvh\{height:100vh;height:100dvh\}/)
  assert.match(
    out,
    /\.x\{max-height:min\(92vh,100vh - 2rem\);max-height:min\(92dvh,100dvh - 2rem\)\}/,
  )
  assert.match(out, /\.y\{max-block-size:min\(68vh,35rem\);max-block-size:min\(68svh,35rem\)\}/)
  assert.match(out, /\.z\{width:100vw;width:100dvw\}/)
})

test('injectViewportUnitFallbacks: is idempotent when vh fallback already present', () => {
  const once = injectViewportUnitFallbacks('.a{height:100dvh}')
  const twice = injectViewportUnitFallbacks(once)
  assert.equal(twice, once)
  assert.equal(twice, '.a{height:100vh;height:100dvh}')
})

test('injectViewportUnitFallbacks: leaves selectors and non-viewport values alone', () => {
  const input = '.max-h-\\[min\\(92dvh\\,calc\\(100dvh-2rem\\)\\)\\]{color:red;height:auto}'
  assert.equal(injectViewportUnitFallbacks(input), input)
})

test('source stays dvh-only — Chrome90 fallback is build-time, not hand-written', () => {
  const appCss = readFileSync(join(root, 'src/shared/styles/app.css'), 'utf8')
  const host = readFileSync(join(root, 'src/views/dapp/host/dapp-host.tsx'), 'utf8')
  const lock = appCss.match(
    /html\.dapp-app,\s*html\.dapp-app body,\s*html\.dapp-app #root\s*\{[^}]+\}/,
  )?.[0]

  assert.ok(lock, 'expected html.dapp-app viewport lock')
  assert.match(lock, /100dvh/)
  assert.doesNotMatch(
    lock,
    /100vh/,
    'do not hand-write vh in source; use viewport-unit-fallbacks plugin',
  )
  assert.match(host, /\bh-dvh\b/)
  assert.doesNotMatch(host, /\bh-screen\b/)
})
