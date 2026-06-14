import type { Locale } from './locales'
import en from './messages/en'

export type Messages = typeof en

const messageLoaders = {
  en: () => Promise.resolve(en),
  zh: () => import('./messages/zh').then((module) => module.default),
} satisfies Record<Locale, () => Promise<Messages>>

export function loadMessages(locale: Locale) {
  return messageLoaders[locale]()
}

export { en as defaultMessages }
