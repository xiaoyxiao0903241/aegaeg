/** Locale codes — leaf module (no imports from other i18n files). */
export const locales = [
  'en',
  'zh',
  'zht',
  'id',
  'ko',
  'ja',
  'vi',
  'es',
  'tr',
  'ru',
  'hi',
  'th',
] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
