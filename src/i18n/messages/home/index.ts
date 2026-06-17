import type { Locale } from '~/i18n/locales'
import type { HomeContentBundle } from '~/home/content/types'
import homeEn from '~/i18n/messages/home/en'
import homeEs from '~/i18n/messages/home/es'
import homeJa from '~/i18n/messages/home/ja'
import homeKo from '~/i18n/messages/home/ko'
import homeRu from '~/i18n/messages/home/ru'
import homeVi from '~/i18n/messages/home/vi'
import homeZh from '~/i18n/messages/home/zh'

export const homeMessagesByLocale = {
  en: homeEn,
  zh: homeZh,
  ko: homeKo,
  ja: homeJa,
  vi: homeVi,
  es: homeEs,
  ru: homeRu,
} satisfies Record<Locale, HomeContentBundle>

export type HomeMessages = HomeContentBundle
