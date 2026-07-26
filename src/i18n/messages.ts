import type { Locale } from '~/i18n/locales'
import type { CatalogMessages } from '~/i18n/messages-catalog'

export type Messages = CatalogMessages

const BOOTSTRAP_SCRIPT_ID = 'aegis-messages'

const messagesCache = new Map<Locale, Messages>()

function readBootstrappedMessages(): { locale: Locale; messages: Messages } | null {
  if (typeof document === 'undefined') return null

  const el = document.getElementById(BOOTSTRAP_SCRIPT_ID)
  if (!el?.textContent?.trim()) return null

  const localeAttr = el.getAttribute('data-locale')
  if (!localeAttr) return null

  try {
    const messages = JSON.parse(el.textContent) as Messages
    return { locale: localeAttr as Locale, messages }
  } catch {
    return null
  }
}

async function importMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case 'en':
      return (await import('~/i18n/messages/en')).default as Messages
    case 'zh':
      return (await import('~/i18n/messages/zh')).default
    case 'zht':
      return (await import('~/i18n/messages/zht')).default as Messages
    case 'id':
      return (await import('~/i18n/messages/id')).default as Messages
    case 'ko':
      return (await import('~/i18n/messages/ko')).default as Messages
    case 'ja':
      return (await import('~/i18n/messages/ja')).default as Messages
    case 'vi':
      return (await import('~/i18n/messages/vi')).default as Messages
    case 'es':
      return (await import('~/i18n/messages/es')).default as Messages
    case 'ru':
      return (await import('~/i18n/messages/ru')).default as Messages
    case 'hi':
      return (await import('~/i18n/messages/hi')).default as Messages
    case 'tr':
      return (await import('~/i18n/messages/tr')).default as Messages
    case 'th':
      return (await import('~/i18n/messages/th')).default as Messages
    default: {
      const _exhaustive: never = locale
      throw new Error(`Unsupported locale: ${_exhaustive}`)
    }
  }
}

/**
 * First paint: read `#aegis-messages` injected by `home-renderer` for the URL locale.
 * Avoids statically bundling all locales into every entry.
 */
export function getMessagesSync(locale: Locale): Messages {
  const cached = messagesCache.get(locale)
  if (cached) return cached

  const boot = readBootstrappedMessages()
  if (boot) {
    messagesCache.set(boot.locale, boot.messages)
    if (boot.locale === locale) {
      return boot.messages
    }
  }

  const again = messagesCache.get(locale)
  if (again) return again

  throw new Error(
    `Missing #${BOOTSTRAP_SCRIPT_ID} bootstrap for locale "${locale}". ` +
      'Ensure render-home injected messages for this HTML entry.',
  )
}

/** Locale switch / warm cache — one locale chunk per call. */
export function loadMessages(locale: Locale): Promise<Messages> {
  const cached = messagesCache.get(locale)
  if (cached) return Promise.resolve(cached)

  return importMessages(locale).then((messages) => {
    messagesCache.set(locale, messages)
    return messages
  })
}

export { BOOTSTRAP_SCRIPT_ID }
