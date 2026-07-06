import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { LEGACY_RUNTIME_POLYFILLS_BOOT_SCRIPT } from '../../src/lib/legacy-runtime-polyfills.ts'

function runPolyfills(context) {
  vm.runInNewContext(LEGACY_RUNTIME_POLYFILLS_BOOT_SCRIPT, context)
}

test('legacy runtime polyfills: Object.hasOwn on Chromium <93', () => {
  const context = { Object }
  delete context.Object.hasOwn
  runPolyfills(context)

  assert.equal(typeof context.Object.hasOwn, 'function')
  assert.equal(context.Object.hasOwn({ a: 1 }, 'a'), true)
  assert.equal(context.Object.hasOwn({ a: 1 }, 'b'), false)
})

test('legacy runtime polyfills: Array and String .at on Chromium <92', () => {
  const context = { Object, Array, String }
  delete context.Array.prototype.at
  delete context.String.prototype.at
  runPolyfills(context)

  assert.equal([10, 20, 30].at(-1), 30)
  assert.equal('abc'.at(-1), 'c')
})

test('legacy runtime polyfills: PerformanceEntryList .at for web-vitals LCP', () => {
  function PerformanceEntryList() {}
  PerformanceEntryList.prototype = { length: 0 }

  const context = {
    Object,
    Array,
    String,
    PerformanceEntryList,
  }
  delete context.Array.prototype.at
  runPolyfills(context)

  const entries = Object.create(PerformanceEntryList.prototype)
  entries[0] = { startTime: 12, url: 'https://example.com' }
  entries.length = 1

  assert.equal(typeof entries.at, 'function')
  assert.equal(entries.at(-1).url, 'https://example.com')
})
