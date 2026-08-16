import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

function installScrollHost() {
  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    requestAnimationFrame: globalThis.requestAnimationFrame,
  }

  const scroller = { scrollTop: 40 }
  const nodes = {
    '[data-dapp-window]': { scrollTop: 12 },
    '[data-dapp-window-scroll]': scroller,
    '[data-dapp-detail]': { scrollTop: 80 },
  }
  let scrollCalls = 0

  globalThis.requestAnimationFrame = (callback) => {
    callback(0)
    return 0
  }
  globalThis.document = {
    querySelector(selector) {
      return nodes[selector] ?? null
    },
    querySelectorAll() {
      return []
    },
  }
  globalThis.window = {
    location: { hash: '' },
    scrollTo() {
      scrollCalls += 1
    },
    setTimeout() {
      return 0
    },
    clearTimeout() {},
  }

  return {
    scroller,
    scrollCount: () => scrollCalls,
    restore() {
      if (previous.window === undefined) delete globalThis.window
      else globalThis.window = previous.window
      if (previous.document === undefined) delete globalThis.document
      else globalThis.document = previous.document
      if (previous.requestAnimationFrame === undefined) {
        delete globalThis.requestAnimationFrame
      } else {
        globalThis.requestAnimationFrame = previous.requestAnimationFrame
      }
    },
  }
}

test('setView and backToHub scroll panels to top when the view changes', async () => {
  const host = installScrollHost()

  try {
    const { createDappSubviewStore } = await loadModule('/src/stores/create-dapp-subview-store.ts')
    const { useStore } = createDappSubviewStore({
      hub: 'hub',
      hashForView: (view) => (view === 'hub' ? '#assets' : `#assets/${view}`),
    })

    useStore.getState().setView('stake')
    assert.equal(host.scroller.scrollTop, 0)
    assert.equal(host.scrollCount(), 1)

    host.scroller.scrollTop = 90
    useStore.getState().backToHub()
    assert.equal(useStore.getState().view, 'hub')
    assert.equal(host.scroller.scrollTop, 0)
    assert.equal(host.scrollCount(), 2)
  } finally {
    host.restore()
  }
})

test('backToHub does not scroll when already on hub or resetting a foreign tab', async () => {
  const host = installScrollHost()

  try {
    const { createDappSubviewStore } = await loadModule('/src/stores/create-dapp-subview-store.ts')
    const { useStore } = createDappSubviewStore({
      hub: 'hub',
      hashForView: (view) => (view === 'hub' ? '#assets' : `#assets/${view}`),
    })

    useStore.getState().backToHub()
    assert.equal(host.scrollCount(), 0)

    useStore.getState().setView('stake')
    assert.equal(host.scrollCount(), 1)
    host.scroller.scrollTop = 50
    useStore.getState().backToHub({ syncHash: false })
    assert.equal(useStore.getState().view, 'hub')
    assert.equal(host.scroller.scrollTop, 50)
    assert.equal(host.scrollCount(), 1)
  } finally {
    host.restore()
  }
})
