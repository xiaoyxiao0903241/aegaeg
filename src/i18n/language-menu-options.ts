import { allLanguageOptions } from '~/i18n/locales'
import type { Locale } from '~/i18n/locale-codes'

/** Active + onSelect wiring for LanguageMenu — home topbar and DApp topbar. */
export function languageMenuOptions(locale: Locale, setLocale: (next: Locale) => void) {
  return allLanguageOptions.map((option) => ({
    code: option.code,
    name: option.name,
    label: option.label,
    active: option.locale === locale,
    onSelect: () => setLocale(option.locale),
  }))
}
