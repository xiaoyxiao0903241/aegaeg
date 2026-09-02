import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('sanitizePopupNoticeHtml without DOMParser escapes as plain text', async () => {
  const { sanitizePopupNoticeHtml } = await loadModule('/src/views/home/popup-notice-content.tsx')
  assert.equal(typeof DOMParser, 'undefined')
  const dirty =
    '<p onclick="alert(1)">hi</p><script>alert(2)</script><a href="javascript:alert(3)">x</a>'
  const clean = sanitizePopupNoticeHtml(dirty)
  assert.equal(clean.includes('<'), false)
  assert.equal(clean.includes('>'), false)
  assert.equal(clean.includes('&lt;p'), true)
  assert.equal(clean.includes('hi'), true)
})

test('sanitizePopupNoticeHtml with DOMParser strips unsafe tags and schemes', async () => {
  const { sanitizePopupNoticeHtml } = await loadModule('/src/views/home/popup-notice-content.tsx')

  class FakeElement {
    constructor(tagName, attrs = {}, children = []) {
      this.tagName = tagName
      this.attributes = Object.entries(attrs).map(([name, value]) => ({ name, value }))
      this.children = children
      this._inner = ''
    }
    querySelectorAll(sel) {
      if (sel !== '*') return []
      const out = []
      const walk = (nodes) => {
        for (const n of nodes) {
          out.push(n)
          walk(n.children)
        }
      }
      walk(this.children)
      return out
    }
    remove() {
      this._removed = true
    }
    removeAttribute(name) {
      this.attributes = this.attributes.filter((a) => a.name !== name)
    }
    setAttribute(name, value) {
      const existing = this.attributes.find((a) => a.name === name)
      if (existing) existing.value = value
      else this.attributes.push({ name, value })
    }
    get innerHTML() {
      return this.children
        .filter((c) => !c._removed)
        .map((c) => {
          const attrs = c.attributes.map((a) => ` ${a.name}="${a.value}"`).join('')
          return `<${c.tagName.toLowerCase()}${attrs}>${c._inner || 'hi'}</${c.tagName.toLowerCase()}>`
        })
        .join('')
    }
  }

  const original = globalThis.DOMParser
  globalThis.DOMParser = class {
    parseFromString() {
      const body = new FakeElement('BODY', {}, [
        new FakeElement('P', { onclick: 'alert(1)' }, []),
        new FakeElement('SCRIPT', {}, []),
        new FakeElement('A', { href: 'javascript:alert(3)' }, []),
        new FakeElement('A', { href: 'https://example.com' }, []),
        new FakeElement('IMG', { src: 'data:text/html,x' }, []),
        new FakeElement('A', { href: 'mailto:a@b.c' }, []),
      ])
      body.children[0]._inner = 'hi'
      return { body }
    }
  }

  try {
    const clean = sanitizePopupNoticeHtml('<p>hi</p>')
    assert.equal(clean.includes('<script'), false)
    assert.equal(/onclick=/i.test(clean), false)
    assert.equal(/javascript:/i.test(clean), false)
    assert.equal(/data:/i.test(clean), false)
    assert.equal(clean.includes('https://example.com'), true)
    assert.equal(clean.includes('mailto:a@b.c'), true)
    assert.equal(clean.includes('hi'), true)
  } finally {
    if (original === undefined) delete globalThis.DOMParser
    else globalThis.DOMParser = original
  }
})
