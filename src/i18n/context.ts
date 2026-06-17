import { createContext } from 'react'
import type { Locale } from '~/i18n/locales'
import type { Messages } from '~/i18n/messages'

export type I18nContextValue = {
  locale: Locale
  localeLabel: string
  messages: Messages
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)
