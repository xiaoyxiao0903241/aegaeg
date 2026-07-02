import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import i18n from '~/i18n/config'
import {
  localeLabels,
  type Locale,
} from '~/i18n/locales'
import {
  getInitialLocale,
  persistLocale,
  withLocalePrefix,
} from '~/i18n/locale'
import {
  getMessagesSync,
  loadMessages,
  type Messages,
} from '~/i18n/messages'
import { I18nContext, type I18nContextValue } from '~/i18n/context'

function createInitialI18nState(): { locale: Locale; messages: Messages } {
  const locale = getInitialLocale()
  persistLocale(locale)
  // Keep the standalone i18next instance in sync with the project's locale
  // resolution (URL > storage > browser > default). This matters because some
  // UI paths still read from react-i18next / i18n.language.
  if (i18n.language !== locale) {
    void i18n.changeLanguage(locale)
  }
  return {
    locale,
    messages: getMessagesSync(locale),
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => createInitialI18nState().locale)
  const [messages, setMessages] = useState<Messages>(() => createInitialI18nState().messages)
  const localeSyncedRef = useRef(true)

  useEffect(() => {
    if (localeSyncedRef.current) {
      localeSyncedRef.current = false
      return
    }

    let cancelled = false

    loadMessages(locale).then((nextMessages) => {
      if (!cancelled) {
        setMessages(nextMessages)
      }
    })

    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }

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
          window.history.replaceState(null, '', nextUrl)
        }
      }

      setLocaleState(nextLocale)
    }

    return {
      locale,
      localeLabel: localeLabels[locale],
      messages,
      setLocale,
    }
  }, [locale, messages])

  return <I18nContext value={value}>{children}</I18nContext>
}
