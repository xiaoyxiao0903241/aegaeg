/**
 * Public i18n surface.
 *
 * Naming map (internals stay as leaf files; import here for app code):
 * - `locale-codes.ts` — locale id SSOT (`locales.json` → `locales` / `Locale` / `defaultLocale`)
 * - `locale-meta.ts` — display + `<html lang>` meta (`localeMeta` / `getHtmlLang`)
 * - `locales.ts` — locale identity barrel (codes + meta + `localeLabels` / menu options)
 * - `locale.ts` — runtime resolution (URL prefix, storage, browser)
 * - `messages.ts` — client runtime loader (bootstrap `#aegis-messages` + dynamic import)
 * - `messages-catalog.ts` — build/SSR static catalog (embeds every locale)
 *
 * Do **not** re-export `messages-catalog` from this barrel — client graphs must use
 * `messages.ts` only. SSR/build: `import { getMessagesForRender } from '~/i18n/messages-catalog'`.
 */

export {
  browserLocale,
  getBrowserLocale,
  getInitialLocale,
  getLocaleFromPathname,
  getPathWithoutLocale,
  getStoredLocale,
  isLocale,
  localeStorageKey,
  persistLocale,
  withLocalePrefix,
} from '~/i18n/locale'
export {
  allLanguageOptions,
  defaultLocale,
  getHtmlLang,
  type LanguageMeta,
  type Locale,
  localeLabels,
  type LocaleMeta,
  localeMeta,
  locales,
} from '~/i18n/locales'

/** Client runtime messages — not the SSR catalog. */
export { I18nProvider } from '~/i18n/i18n-provider'
export { languageMenuOptions } from '~/i18n/language-menu-options'
export { BOOTSTRAP_SCRIPT_ID, getMessagesSync, loadMessages, type Messages } from '~/i18n/messages'
export { useI18n } from '~/i18n/use-i18n'
