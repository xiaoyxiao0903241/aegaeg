import type { Locale } from '~/i18n/locales'
import appEn from './en'
import appEs from './es'
import appJa from './ja'
import appKo from './ko'
import appRu from './ru'
import appVi from './vi'
import appZh from './zh'

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
