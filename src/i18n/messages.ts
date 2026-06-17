import type { Locale } from './locales'
import en from './messages/en'
import zh from './messages/zh'
import ko from './messages/ko'
import ja from './messages/ja'
import vi from './messages/vi'
import es from './messages/es'
import ru from './messages/ru'

export type Messages = typeof en

const messagesByLocale = {
  en,
  zh,
  ko,
  ja,
  vi,
  es,
  ru,
} satisfies Record<Locale, Messages>

const messageLoaders = {
  en: () => Promise.resolve(en),
  zh: () => Promise.resolve(zh),
  ko: () => Promise.resolve(ko),
  ja: () => Promise.resolve(ja),
  vi: () => Promise.resolve(vi),
  es: () => Promise.resolve(es),
  ru: () => Promise.resolve(ru),
} satisfies Record<Locale, () => Promise<Messages>>

/** 首屏同步读取，避免 async load 导致文案闪动 */
export function getMessagesSync(locale: Locale): Messages {
  return messagesByLocale[locale]
}

export function loadMessages(locale: Locale) {
  return messageLoaders[locale]()
}

export { en as defaultMessages }
