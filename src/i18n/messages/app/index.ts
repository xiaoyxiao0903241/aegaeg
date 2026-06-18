import type { Locale } from '~/i18n/locales'
import appEn from '~/i18n/messages/app/en'
import appEs from '~/i18n/messages/app/es'
import appJa from '~/i18n/messages/app/ja'
import appKo from '~/i18n/messages/app/ko'
import appRu from '~/i18n/messages/app/ru'
import appVi from '~/i18n/messages/app/vi'
import appZh from '~/i18n/messages/app/zh'

export type { AppMessagesBundle } from '~/i18n/messages/app/en'

export const appMessagesByLocale = {
  en: appEn,
  zh: appZh,
  ko: appKo,
  ja: appJa,
  vi: appVi,
  es: appEs,
  ru: appRu,
} satisfies Record<Locale, typeof appEn>

export type AppMessages = typeof appEn
