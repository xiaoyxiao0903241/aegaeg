export const locales = ['en', 'zh', 'ko', 'ja', 'vi', 'es', 'ru'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export { localeMeta, type LocaleMeta } from './locale-meta'
export { resolveHomeContentLocale, getHtmlLang } from './locale-meta'

import { localeMeta } from './locale-meta'

export const localeLabels: Record<Locale, string> = Object.fromEntries(
  locales.map((locale) => [locale, localeMeta[locale].label]),
) as Record<Locale, string>

export type LanguageMeta = {
  code: string
  name: string
  label: string
  locale: Locale
}

export const allLanguageOptions: LanguageMeta[] = locales.map((locale) => ({
  code: localeMeta[locale].menuCode,
  name: localeMeta[locale].menuName,
  label: localeMeta[locale].menuLabel,
  locale,
}))
