import { defaultLocale, locales, type Locale } from './locales'
import { getHtmlLang } from './locale-meta'

export const localeStorageKey = 'aegis.locale'

export function isLocale(value: string | null | undefined): value is Locale {
  if (!value) return false
  const normalized = value.toLowerCase()
  return locales.includes(normalized as Locale)
}

function normalizeLocaleTag(tag: string): Locale | null {
  const lower = tag.toLowerCase()

  if (lower.startsWith('zh')) {
    if (lower.includes('tw') || lower.includes('hk') || lower.includes('hant')) {
      return 'zh-tw'
    }
    return 'zh'
  }

  const direct = lower.split('-')[0]
  if (isLocale(direct)) {
    return direct
  }

  return null
}

export function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return defaultLocale
  }

  const candidates = [
    ...navigator.languages,
    navigator.language,
  ].filter(Boolean)

  for (const tag of candidates) {
    const resolved = normalizeLocaleTag(tag)
    if (resolved) {
      return resolved
    }
  }

  return defaultLocale
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [segment] = pathname.split('/').filter(Boolean)
  if (!segment) return null
  return isLocale(segment) ? (segment.toLowerCase() as Locale) : null
}

export function getPathWithoutLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && isLocale(parts[0])) {
    parts.shift()
  }

  if (parts.length === 0) {
    return '/'
  }

  return `/${parts.join('/')}`
}

export function withLocalePrefix(locale: Locale, pathname: string) {
  if (pathname.startsWith('#')) {
    return pathname
  }

  const logicalPath = getPathWithoutLocale(pathname)
  return logicalPath === '/' ? `/${locale}/` : `/${locale}${logicalPath}`
}

export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(localeStorageKey)
  if (isLocale(stored)) {
    return stored.toLowerCase() as Locale
  }

  return null
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  return (
    getLocaleFromPathname(window.location.pathname) ??
    getStoredLocale() ??
    getBrowserLocale()
  )
}

export function persistLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(localeStorageKey, locale)
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = getHtmlLang(locale)
  }
}
