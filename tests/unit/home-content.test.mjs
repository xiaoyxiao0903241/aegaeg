import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const locales = ['en', 'zh', 'ko', 'ja', 'vi', 'es', 'ru']

async function loadHomeContent() {
  const server = await createServer({
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { hmr: false, middlewareMode: true },
  })

  try {
    return await server.ssrLoadModule('/src/home/content.ts')
  } finally {
    await server.close()
  }
}

function sectionCounts(content) {
  return {
    nav: content.nav.links.length,
    protocol: content.sections.protocol.cards.length,
    engine: content.sections.engine.cards.length,
    token: content.sections.token.cards.length,
    roadmap: content.sections.roadmap.phases.length,
    security: content.sections.security.checks.length,
    partners: content.sections.partners.items.length,
    faq: content.sections.faq.items.length,
    metrics: content.metrics.length,
    footerGroups: content.footer.groups.length,
  }
}

test('homepage content exposes matching structures across all locales', async () => {
  const { getHomeContent } = await loadHomeContent()
  const en = getHomeContent('en')
  const baseline = sectionCounts(en)

  for (const locale of locales) {
    const content = getHomeContent(locale)
    assert.deepEqual(sectionCounts(content), baseline, locale)
    assert.equal(content.nav.languages.length, 7, locale)
    assert.equal(
      content.nav.languages.filter((option) => option.active).length,
      1,
      locale,
    )
    assert.equal(
      content.nav.languages.find((option) => option.active)?.code,
      content.nav.languages.find((option) => option.active)?.code,
      locale,
    )
  }
})

test('homepage localized copy covers static HTML, wallet, and footer text', async () => {
  const { getHomeContent } = await loadHomeContent()
  const en = getHomeContent('en')
  const zh = getHomeContent('zh')
  const ko = getHomeContent('ko')

  assert.equal(en.meta.title, 'AEGIS X - Guarding the Future of Value')
  assert.equal(zh.meta.title, 'AEGIS X - 守护未来价值')
  assert.equal(ko.meta.title, 'AEGIS X - 미래 가치의 수호')
  assert.equal(en.hero.title, 'Guarding the Future of Value')
  assert.equal(zh.hero.title, '守护未来价值')
  assert.equal(en.hero.enterProtocol, 'Enter Protocol')
  assert.equal(zh.hero.enterProtocol, '进入协议')
  assert.equal(en.nav.launchDapp, 'Launch DApp')
  assert.equal(zh.nav.launchDapp, '启动 DApp')
  assert.equal(en.nav.languages[0].active, true)
  assert.equal(zh.nav.languages[1].active, true)
  assert.equal(en.footer.languages[1].href, '/zh/')
  assert.equal(en.hero.walletBusy, 'Opening wallet...')
  assert.equal(zh.hero.walletBusy, '正在打开钱包...')
  assert.equal(en.sections.token.title, 'Multi-asset flywheel')
  assert.equal(zh.sections.token.title, '多资产价值飞轮')
  assert.match(zh.footer.copyright, /保留所有权利/)
  assert.notEqual(ko.hero.title, en.hero.title)
})
