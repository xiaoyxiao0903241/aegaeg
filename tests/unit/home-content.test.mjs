import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const locales = JSON.parse(readFileSync(resolve(root, 'src/i18n/locales.json'), 'utf8'))

async function loadHomeMessages() {
  return loadModule('/src/i18n/messages/home/index.ts')
}

function sectionCounts(home) {
  return {
    nav: home.nav.links.length,
    protocol: home.sections.protocol.cards.length,
    engine: home.sections.engine.cards.length,
    token: home.sections.token.cards.length,
    roadmap: home.sections.roadmap.phases.length,
    security: home.sections.security.checks.length,
    faq: home.sections.faq.items.length,
    metrics: home.metrics.length,
    footerGroups: home.footer.groups.length,
  }
}

test('home messages expose matching structures across all locales', async () => {
  const { homeMessagesByLocale } = await loadHomeMessages()
  const zh = homeMessagesByLocale.zh
  const baseline = sectionCounts(zh)

  for (const locale of locales) {
    const home = homeMessagesByLocale[locale]
    assert.deepEqual(sectionCounts(home), baseline, locale)
  }
})

test('home localized copy covers meta, hero, and footer text', async () => {
  const { homeMessagesByLocale } = await loadHomeMessages()
  const zh = homeMessagesByLocale.zh
  const en = homeMessagesByLocale.en
  const zht = homeMessagesByLocale.zht

  assert.equal(zh.meta.title, 'AEGIS X - 守护未来价值网络')
  assert.equal(en.meta.title, 'AEGIS X - Guarding the Future Value Network')
  assert.equal(zht.meta.title, 'AEGIS X - 守護未來價值網路')
  assert.equal(zh.hero.title, '守护未来价值网络')
  assert.equal(en.hero.title, 'Guarding the Future Value Network')
  assert.equal(zh.hero.enterProtocol, '进入协议')
  assert.equal(en.hero.enterProtocol, 'Enter Protocol')
  assert.equal(zh.sections.token.title, '多资产价值飞轮')
  assert.match(zh.footer.copyright, /保留所有权利/)
  assert.notEqual(en.hero.title, zh.hero.title)
})
