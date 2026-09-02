import localeCodes from '~/i18n/locales.json'

/**
 * Locale codes SSOT — list lives in `locales.json` (Node/Vite scripts read the same file).
 * Tuple cast keeps `Locale` a closed string-literal union.
 */
export const locales = localeCodes as unknown as readonly [
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
]

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
