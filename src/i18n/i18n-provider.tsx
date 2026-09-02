import { type ReactNode, useMemo, useRef, useState } from 'react'

import { I18nContext, type I18nContextValue } from '~/i18n/context'
import { getInitialLocale, persistLocale, withLocalePrefix } from '~/i18n/locale'
import { type Locale, localeLabels } from '~/i18n/locales'
import { getMessagesSync, loadMessages, type Messages } from '~/i18n/messages'

function createInitialI18nState(): { locale: Locale; messages: Messages } {
  const locale = getInitialLocale()
  persistLocale(locale)
  return {
    locale,
    messages: getMessagesSync(locale),
  }
}

/** 全站文案 SSOT：仅走本 Provider，不再同步独立 i18next 实例。 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [{ locale, messages }, setState] = useState(createInitialI18nState)
  /** Monotonic load id — drop stale `loadMessages` results after rapid setLocale. */
  const localeLoadGeneration = useRef(0)

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

      // Load then commit — avoid flash of previous locale copy; ignore superseded loads.
      const generation = ++localeLoadGeneration.current
      void loadMessages(nextLocale)
        .then((nextMessages) => {
          if (generation !== localeLoadGeneration.current) return
          setState({ locale: nextLocale, messages: nextMessages })
        })
        .catch(() => {
          // Keep current messages; cookie/URL already point at nextLocale for retry/reload.
        })
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
