import { useMemo } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { buildHomeContent } from '~/home/content/build-home-content'
import type { HomeContent } from '~/home/content/types'

export function useHomeContent(): HomeContent {
  const { locale, messages } = useI18n()

  return useMemo(
    () => buildHomeContent(locale, messages.home),
    [locale, messages.home],
  )
}
