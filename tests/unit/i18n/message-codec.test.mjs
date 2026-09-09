import assert from 'node:assert/strict'
import test from 'node:test'
import { deflateRawSync } from 'node:zlib'

import { loadModule } from '../load-module.mjs'

/** CJK 检测：简繁中文 + 平假名/片假名 + 谚文 */
const CJK = /[一-鿿぀-ヿ가-힯]/

/** 引导脚本里编码载荷的提取模式；base64 不含 `<`，可安全用 `[^<]+` 匹配 */
const BOOTSTRAP_PAYLOAD = /id="aegis-messages"[^>]*>([^<]+)<\/script>/u

async function loadRenderer() {
  return loadModule('/src/views/home/home-renderer.ts')
}

test('rendered documents contain no plaintext CJK copy (anti-scan contract)', async () => {
  const renderer = await loadRenderer()

  for (const locale of ['zh', 'zht', 'ja', 'ko', 'th']) {
    const docs = [
      ['index', renderer.renderHomeDocument(locale)],
      ['app', renderer.renderAppDocument(locale)],
    ]

    for (const [label, doc] of docs) {
      assert.ok(doc.includes('id="aegis-messages"'), `${locale} ${label}: bootstrap script missing`)
      assert.ok(
        !CJK.test(doc),
        `${locale} ${label}: plaintext CJK copy leaked into the static HTML document`,
      )
    }
  }
})

test('encoded bootstrap round-trips through the browser decoder', async () => {
  const renderer = await loadRenderer()
  const codec = await loadModule('/src/i18n/message-codec.ts')
  const catalog = await loadModule('/src/i18n/messages-catalog.ts')
  const full = catalog.getMessagesForRender('zh')

  const appPayload = renderer.renderAppDocument('zh').match(BOOTSTRAP_PAYLOAD)?.[1]
  assert.ok(appPayload, 'app bootstrap payload not found')
  assert.deepEqual(codec.inflateMessages(codec.base64ToBytes(appPayload)), full)

  const homePayload = renderer.renderHomeDocument('zh').match(BOOTSTRAP_PAYLOAD)?.[1]
  assert.ok(homePayload, 'home bootstrap payload not found')
  assert.deepEqual(codec.inflateMessages(codec.base64ToBytes(homePayload)), {
    common: full.common,
    errors: full.errors,
    home: full.home,
  })
})

test('raw deflate bin payload (render-home path) decodes with the same core', async () => {
  const codec = await loadModule('/src/i18n/message-codec.ts')
  const sample = { common: { brand: 'AEGIS X' }, home: { title: 't' }, errors: {} }

  // 与 scripts/render-home.mjs 的编码端一致：deflate-raw、无 zlib 头
  const bin = new Uint8Array(deflateRawSync(JSON.stringify(sample)))
  assert.deepEqual(codec.inflateMessages(bin), sample)
})

test('zh and zht head meta are English-only (displayMeta stays localized)', async () => {
  const en = (await loadModule('/src/i18n/messages/home/en.ts')).default

  for (const locale of ['zh', 'zht']) {
    const mod = (await loadModule(`/src/i18n/messages/home/${locale}.ts`)).default
    // 静态 head：英文，防扫描
    assert.equal(mod.meta.title, en.meta.title)
    assert.equal(mod.meta.description, en.meta.description)
    assert.ok(!CJK.test(`${mod.meta.title} ${mod.meta.description}`))
    // 运行时覆写：本地化文案仍在（随编码消息袋下发）
    assert.ok(CJK.test(mod.displayMeta.title), `${locale} displayMeta.title lost localization`)
    assert.ok(CJK.test(mod.displayMeta.description))
  }
})
