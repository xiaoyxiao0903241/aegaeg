import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { LEGACY_DOM_POLYFILLS_BOOT_SCRIPT } from '../../src/shared/lib/legacy-runtime-polyfills.ts'

function runBootPolyfills(context) {
  vm.runInNewContext(LEGACY_DOM_POLYFILLS_BOOT_SCRIPT, context)
}

test('legacy boot polyfills: Object.hasOwn and Array.at', () => {
  const context = { Object, Array, String }
  delete context.Object.hasOwn
  delete context.Array.prototype.at
  runBootPolyfills(context)

  assert.equal(context.Object.hasOwn({ a: 1 }, 'a'), true)
  assert.equal([10, 20, 30].at(-1), 30)
})

test('legacy boot polyfills: patches PerformanceEntryList via observer list', () => {
  function PerformanceEntryList() {}
  PerformanceEntryList.prototype = { length: 0, 0: { startTime: 1 } }

  const entries = Object.create(PerformanceEntryList.prototype)
  entries.length = 1

  const context = {
    Object,
    Array,
    String,
    PerformanceObserver: function (cb) {
      this._cb = cb
      this.observe = () => {
        cb({ getEntries: () => entries })
      }
    },
  }
  context.PerformanceObserver.prototype = {}

  runBootPolyfills(context)

  const observer = new context.PerformanceObserver(() => {})
  observer.observe({ type: 'paint', buffered: true })

  assert.equal(typeof entries.at, 'function')
  assert.equal(entries.at(-1).startTime, 1)
})

test('legacy boot polyfills: eager patches performance.getEntriesByType lists', () => {
  function PerformanceEntryList() {}
  PerformanceEntryList.prototype = { length: 0 }

  const paintEntries = Object.create(PerformanceEntryList.prototype)
  paintEntries.length = 2
  paintEntries[0] = { name: 'first-paint', startTime: 10 }
  paintEntries[1] = { name: 'first-contentful-paint', startTime: 20 }

  const context = {
    Object,
    Array,
    String,
    performance: {
      getEntriesByType(type) {
        return type === 'paint' ? paintEntries : Object.create(PerformanceEntryList.prototype)
      },
      getEntries() {
        return paintEntries
      },
    },
  }

  runBootPolyfills(context)

  const list = context.performance.getEntriesByType('paint')
  assert.equal(typeof list.at, 'function')
  assert.equal(list.at(-1).name, 'first-contentful-paint')
})
