import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('exchange hub copy contract: 4 modes, 6 program cards, 5 FAQs', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const hub = enModule.default.exchange.hub

  assert.equal(hub.modes.flash.title, 'Flash')
  assert.ok(hub.modes.turbine?.title)
  assert.ok(hub.modes.burn?.title)
  assert.ok(hub.modes.trade?.title)
  assert.equal(hub.modes.comingSoon, undefined)
  assert.equal(hub.about, undefined)
  assert.equal(hub.program.cards.length, 6)
  assert.equal(hub.faq.items.length, 5)
})

test('flash pair tabs expose both live pair labels', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const flash = enModule.default.exchange.flash

  assert.ok(flash.pairs.usdt.includes('USDT'))
  assert.ok(flash.pairs.gagx.includes('gAGX'))
  assert.ok(flash.pairAriaLabel)
  assert.ok(flash.intros.gagx)
  assert.ok(flash.intros.usdt)
  assert.ok(flash.aboutTitle)
  assert.ok(flash.faq.items.length >= 5)
})

test('isSegmentOptionEnabled respects option.disabled and list disabled', async () => {
  const { isSegmentOptionEnabled } = await loadModule('/src/shared/ui/segment.tsx')

  assert.equal(isSegmentOptionEnabled({ label: 'A', value: 'a' }, false), true)
  assert.equal(isSegmentOptionEnabled({ label: 'A', value: 'a', disabled: true }, false), false)
  assert.equal(isSegmentOptionEnabled({ label: 'A', value: 'a' }, true), false)
})
