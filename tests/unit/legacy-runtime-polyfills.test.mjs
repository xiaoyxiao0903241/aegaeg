import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { LEGACY_RUNTIME_POLYFILLS_BOOT_SCRIPT } from '../../src/lib/legacy-runtime-polyfills.ts'

test('legacy runtime polyfills: Object.hasOwn and Array.at on Chromium <93', () => {
  const context = {
    Object: Object,
    Array: Array,
  }
  delete context.Object.hasOwn
  delete context.Array.prototype.at

  vm.runInNewContext(LEGACY_RUNTIME_POLYFILLS_BOOT_SCRIPT, context)

  assert.equal(typeof context.Object.hasOwn, 'function')
  assert.equal(context.Object.hasOwn({ a: 1 }, 'a'), true)
  assert.equal(context.Object.hasOwn({ a: 1 }, 'b'), false)

  assert.equal([1, 2, 3].at.call([10, 20, 30], -1), 30)
  assert.equal([1, 2, 3].at.call([10, 20, 30], 1), 20)
})
