import type { Locale } from './locales'
import en from './messages/en'

export type Messages = typeof en

const messageLoaders = {
  en: () => Promise.resolve(en),
  zh: () => import('./messages/zh').then((module) => module.default),
  'zh-tw': () => import('./messages/zh-tw').then((module) => module.default),
  ko: () => import('./messages/ko').then((module) => module.default),
  ja: () => import('./messages/ja').then((module) => module.default),
  vi: () => import('./messages/vi').then((module) => module.default),
  es: () => import('./messages/es').then((module) => module.default),
  ru: () => import('./messages/ru').then((module) => module.default),
} satisfies Record<Locale, () => Promise<Messages>>

export function loadMessages(locale: Locale) {
  return messageLoaders[locale]()
}

export { en as defaultMessages }
