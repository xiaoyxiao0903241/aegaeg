import {
  useEffect,
  useMemo,
  useRef,
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
  getMessagesSync,
  loadMessages,
  type Messages,
} from './messages'
import { I18nContext, type I18nContextValue } from './context'

function createInitialI18nState() {
  const locale = getInitialLocale()
  persistLocale(locale)
  return {
    locale,
    messages: getMessagesSync(locale),
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const initialState = useRef(createInitialI18nState())
  const [locale, setLocaleState] = useState<Locale>(initialState.current.locale)
  const [messages, setMessages] = useState<Messages>(initialState.current.messages)
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
