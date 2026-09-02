/**
 * Build / SSR-only catalog — static imports of every locale.
 * Client runtime must use `~/i18n/messages` (bootstrap + dynamic import) instead,
 * so Home / DApp entry graphs do not embed all locales.
 */
import type { Locale } from '~/i18n/locales'
import en from '~/i18n/messages/en'
import es from '~/i18n/messages/es'
import hi from '~/i18n/messages/hi'
import id from '~/i18n/messages/id'
import ja from '~/i18n/messages/ja'
import ko from '~/i18n/messages/ko'
import ru from '~/i18n/messages/ru'
import th from '~/i18n/messages/th'
import tr from '~/i18n/messages/tr'
import vi from '~/i18n/messages/vi'
import zh from '~/i18n/messages/zh'
import zht from '~/i18n/messages/zht'

/** Structural SSOT for locale bags — same anchor as historical `messages.ts`. */
export type CatalogMessages = typeof zh

export const messagesByLocale = {
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
  tr,
  th,
} as Record<Locale, CatalogMessages>

export function getMessagesForRender(locale: Locale): CatalogMessages {
  return messagesByLocale[locale]
}
