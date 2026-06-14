import { createContext } from 'react'
import type { Locale } from './locales'
import type { Messages } from './messages'

export type I18nContextValue = {
  locale: Locale
  localeLabel: string
  messages: Messages
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)
