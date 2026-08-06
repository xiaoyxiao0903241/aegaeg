import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

function mockBrowserLocation(location) {
  const originals = {
    location: globalThis.location,
    document: globalThis.document,
  }

  globalThis.location = location
  globalThis.document = { location }

  return () => {
    if (originals.location === undefined) {
      delete globalThis.location
    } else {
      globalThis.location = originals.location
    }
    globalThis.document = originals.document
  }
}

test('getRuntimeHostname reads browser host', async () => {
  const { getRuntimeHostname } = await loadModule('/src/shared/lib/runtime-host.ts')
  const restore = mockBrowserLocation({
    host: 'app.x-123.io',
    hostname: 'app.x-123.io',
    origin: 'https://app.x-123.io',
  })

  try {
    assert.equal(getRuntimeHostname(), 'app.x-123.io')
  } finally {
    restore()
  }
})

test('getRuntimeHostname falls back to VITE_APP_HOST', async () => {
  const { getRuntimeHostname, getConfiguredAppHost } = await loadModule(
    '/src/shared/lib/runtime-host.ts',
  )
  const restore = mockBrowserLocation({ host: '', hostname: '', origin: '' })

  try {
    assert.equal(getRuntimeHostname(), getConfiguredAppHost())
  } finally {
    restore()
  }
})

test('apiBaseUrl uses runtime hostname when option omitted', async () => {
  const { apiBaseUrl } = await loadModule('/src/shared/api/api-base-url.ts')
  const restore = mockBrowserLocation({
    host: 'app.x-123.io',
    hostname: 'app.x-123.io',
    origin: 'https://app.x-123.io',
  })

  try {
    assert.equal(apiBaseUrl({ isDev: false, deriveFromDomain: true }), 'https://api.x-123.io/api')
  } finally {
    restore()
  }
})
