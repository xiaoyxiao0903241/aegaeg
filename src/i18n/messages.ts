import type { Locale } from '~/i18n/locales'
import en from '~/i18n/messages/en'
import zh from '~/i18n/messages/zh'
import ko from '~/i18n/messages/ko'
import ja from '~/i18n/messages/ja'
import vi from '~/i18n/messages/vi'
import es from '~/i18n/messages/es'
import ru from '~/i18n/messages/ru'

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

/** 首屏同步读取，避免 async load 导致文案闪动 */
export function getMessagesSync(locale: Locale): Messages {
  return messagesByLocale[locale]
}

export function loadMessages(locale: Locale) {
  return Promise.resolve(messagesByLocale[locale])
}
