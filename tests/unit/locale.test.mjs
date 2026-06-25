import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const localeModule = await loadModule('/src/i18n/locale.ts')
const localesModule = await loadModule('/src/i18n/locales.ts')
const { isLocale, getLocaleFromPathname, getPathWithoutLocale, withLocalePrefix, resolveBrowserLocale, getInitialLocale } = localeModule
const { defaultLocale } = localesModule

test('isLocale validates supported locales case-insensitively', () => {
  assert.equal(isLocale('zh'), true)
  assert.equal(isLocale('ZH'), true)
  assert.equal(isLocale('zht'), true)
  assert.equal(isLocale('tr'), true)
  assert.equal(isLocale('fr'), false)
  assert.equal(isLocale(''), false)
  assert.equal(isLocale(null), false)
})

test('getLocaleFromPathname extracts locale prefix', () => {
  assert.equal(getLocaleFromPathname('/zh/app'), 'zh')
  assert.equal(getLocaleFromPathname('/ZH/app'), 'zh')
  assert.equal(getLocaleFromPathname('/tr/'), 'tr')
  assert.equal(getLocaleFromPathname('/app'), null)
  assert.equal(getLocaleFromPathname('/'), null)
})

test('getPathWithoutLocale strips locale prefix', () => {
  assert.equal(getPathWithoutLocale('/zh/app'), '/app')
  assert.equal(getPathWithoutLocale('/en/'), '/')
  assert.equal(getPathWithoutLocale('/app'), '/app')
  assert.equal(getPathWithoutLocale('/'), '/')
})

test('withLocalePrefix builds localized paths', () => {
  assert.equal(withLocalePrefix('zh', '/app'), '/zh/app')
  assert.equal(withLocalePrefix('en', '/'), '/en/')
  assert.equal(withLocalePrefix('zh', '#section'), '#section')
})

test('resolveBrowserLocale maps navigator languages to supported locales', () => {
  assert.equal(resolveBrowserLocale('zh-CN', ['zh-CN', 'zh', 'en-US', 'en']), 'zh')
  assert.equal(resolveBrowserLocale('zh-TW', ['zh-TW']), 'zht')
  assert.equal(resolveBrowserLocale('zh-HK', ['zh-HK', 'zh']), 'zht')
  assert.equal(resolveBrowserLocale('ko-KR', ['ko-KR', 'ko']), 'ko')
  assert.equal(resolveBrowserLocale('tr-TR', ['tr-TR']), 'tr')
  assert.equal(resolveBrowserLocale('fr-FR', ['fr-FR', 'en-US']), 'en')
  assert.equal(resolveBrowserLocale('fr-FR', ['fr-FR']), null)
  assert.equal(resolveBrowserLocale('und', []), null)
  assert.equal(resolveBrowserLocale(undefined, undefined), null)
})

test('getInitialLocale respects priority: pathname > storage > browser > default', () => {
  const originalWindow = globalThis.window
  const originalNavigator = globalThis.navigator

  const mockWindow = ({ pathname, storedLocale }) => ({
    location: { pathname },
    localStorage: { getItem: () => storedLocale },
  })

  const setNavigator = (navigator) => {
    Object.defineProperty(globalThis, 'navigator', {
      value: navigator,
      configurable: true,
      writable: true,
    })
  }

  globalThis.window = mockWindow({ pathname: '/ko/app', storedLocale: null })
  setNavigator(undefined)
  assert.equal(getInitialLocale(), 'ko')

  globalThis.window = mockWindow({ pathname: '/', storedLocale: 'zh' })
  assert.equal(getInitialLocale(), 'zh')

  globalThis.window = mockWindow({ pathname: '/', storedLocale: null })
  setNavigator({ language: 'ja-JP', languages: ['ja-JP'] })
  assert.equal(getInitialLocale(), 'ja')

  setNavigator({ language: 'fr-FR', languages: ['fr-FR'] })
  assert.equal(getInitialLocale(), defaultLocale)

  globalThis.window = originalWindow
  setNavigator(originalNavigator)
})
