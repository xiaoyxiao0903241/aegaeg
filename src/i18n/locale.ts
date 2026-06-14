import { defaultLocale, locales, type Locale } from './locales'

export const localeStorageKey = 'aegis.locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale)
}

export function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return defaultLocale
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : defaultLocale
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [segment] = pathname.split('/').filter(Boolean)
  return isLocale(segment) ? segment : null
}

export function getPathWithoutLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (isLocale(parts[0])) {
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
    return stored
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
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }
}
