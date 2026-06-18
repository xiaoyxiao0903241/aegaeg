import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const locales = ['en', 'zh', 'ko', 'ja', 'vi', 'es', 'ru']

async function loadHomeMessages() {
  const server = await createServer({
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { hmr: false, middlewareMode: true },
  })

  try {
    return await server.ssrLoadModule('/src/i18n/messages/home/index.ts')
  } finally {
    await server.close()
  }
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
  const en = homeMessagesByLocale.en
  const baseline = sectionCounts(en)

  for (const locale of locales) {
    const home = homeMessagesByLocale[locale]
    assert.deepEqual(sectionCounts(home), baseline, locale)
  }
})

test('home localized copy covers meta, hero, and footer text', async () => {
  const { homeMessagesByLocale } = await loadHomeMessages()
  const en = homeMessagesByLocale.en
  const zh = homeMessagesByLocale.zh
  const ko = homeMessagesByLocale.ko

  assert.equal(en.meta.title, 'AEGIS X - Guarding the Future of Value')
  assert.equal(zh.meta.title, 'AEGIS X - 守护未来价值')
  assert.equal(ko.meta.title, 'AEGIS X - 미래 가치의 수호')
  assert.equal(en.hero.title, 'Guarding the Future of Value')
  assert.equal(zh.hero.title, '守护未来价值')
  assert.equal(en.hero.enterProtocol, 'Enter Protocol')
  assert.equal(zh.hero.enterProtocol, '进入协议')
  assert.equal(en.sections.token.title, 'Multi-asset flywheel')
  assert.equal(zh.sections.token.title, '多资产价值飞轮')
  assert.match(zh.footer.copyright, /保留所有权利/)
  assert.notEqual(ko.hero.title, en.hero.title)
})
