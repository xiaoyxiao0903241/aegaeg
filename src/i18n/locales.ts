/** Public locale barrel — re-exports leaf modules (no circular deps). */
export { defaultLocale, type Locale, locales } from '~/i18n/locale-codes'
export { getHtmlLang, type LocaleMeta, localeMeta } from '~/i18n/locale-meta'

import { type Locale, locales } from '~/i18n/locale-codes'
import { localeMeta } from '~/i18n/locale-meta'

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
