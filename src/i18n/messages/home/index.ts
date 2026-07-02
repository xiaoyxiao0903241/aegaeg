import type { Locale } from '~/i18n/locales'
import homeEn from '~/i18n/messages/home/en'
import homeEs from '~/i18n/messages/home/es'
import homeHi from '~/i18n/messages/home/hi'
import homeId from '~/i18n/messages/home/id'
import homeJa from '~/i18n/messages/home/ja'
import homeKo from '~/i18n/messages/home/ko'
import homeRu from '~/i18n/messages/home/ru'
import homeVi from '~/i18n/messages/home/vi'
import homeZh from '~/i18n/messages/home/zh'
import homeZht from '~/i18n/messages/home/zht'
import homeTr from '~/i18n/messages/home/tr'

export type { HomeMessagesBundle } from '~/i18n/messages/home/types'

export const homeMessagesByLocale = {
  en: homeEn,
  zh: homeZh,
  zht: homeZht,
  id: homeId,
  ko: homeKo,
  ja: homeJa,
  vi: homeVi,
  es: homeEs,
  ru: homeRu,
  hi: homeHi,
  tr: homeTr,
} satisfies Record<Locale, typeof homeZh>
