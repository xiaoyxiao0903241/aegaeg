import type { Locale } from '~/i18n/locales'
import en from '~/i18n/messages/en'
import zh from '~/i18n/messages/zh'
import zht from '~/i18n/messages/zht'
import id from '~/i18n/messages/id'
import ko from '~/i18n/messages/ko'
import ja from '~/i18n/messages/ja'
import vi from '~/i18n/messages/vi'
import es from '~/i18n/messages/es'
import ru from '~/i18n/messages/ru'
import hi from '~/i18n/messages/hi'

export type Messages = typeof zh

const messagesByLocale = {
  en,
  zh,
  zht,
  id,
  ko,
  ja,
  vi,
  es,
  ru,
  hi,
} satisfies Record<Locale, Messages>

/** 首屏同步读取，避免 async load 导致文案闪动 */
export function getMessagesSync(locale: Locale): Messages {
  return messagesByLocale[locale]
}

export function loadMessages(locale: Locale) {
  return Promise.resolve(messagesByLocale[locale])
}
