import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  localeLabels,
  type Locale,
} from './locales'
import {
  getInitialLocale,
  persistLocale,
  withLocalePrefix,
} from './locale'
import {
  defaultMessages,
  loadMessages,
  type Messages,
} from './messages'
import { I18nContext, type I18nContextValue } from './context'

type LoadedMessages = {
  locale: Locale
  messages: Messages
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initialLocale = getInitialLocale()
    persistLocale(initialLocale)
    return initialLocale
  })
  const [loaded, setLoaded] = useState<LoadedMessages>(() => ({
    locale: 'en',
    messages: defaultMessages,
  }))

  useEffect(() => {
    let cancelled = false

    loadMessages(locale).then((nextMessages) => {
      if (!cancelled) {
        setLoaded({ locale, messages: nextMessages })
      }
    })

    return () => {
      cancelled = true
    }
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    function setLocale(nextLocale: Locale) {
      persistLocale(nextLocale)

      if (typeof window !== 'undefined') {
        const nextPath = withLocalePrefix(nextLocale, window.location.pathname)
        const nextUrl = `${nextPath}${window.location.search}${window.location.hash}`
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

        if (nextUrl !== currentUrl) {
          window.location.assign(nextUrl)
          return
        }
      }

      setLocaleState(nextLocale)
    }

    return {
      locale,
      localeLabel: localeLabels[locale],
      messages: loaded.messages,
      setLocale,
    }
  }, [loaded.messages, locale])

  if (loaded.locale !== locale) {
    return null
  }

  return <I18nContext value={value}>{children}</I18nContext>
}
