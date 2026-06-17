import type { Locale } from '~/i18n/locales'
import type { HomeContentBundle } from '~/home/content/types'
import homeEn from './en'
import homeEs from './es'
import homeJa from './ja'
import homeKo from './ko'
import homeRu from './ru'
import homeVi from './vi'
import homeZh from './zh'

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
