import type { Locale } from '~/i18n/locales'
import { locales } from '~/i18n/locales'
import { homeMessagesByLocale } from '~/i18n/messages/home'
import { buildHomeContent } from '~/home/content/build-home-content'
import type { HomeContent } from '~/home/content/types'

export function getHomeContent(locale: Locale): HomeContent {
  return buildHomeContent(locale, homeMessagesByLocale[locale])
}

export function getAllHomeLocales(): Locale[] {
  return [...locales]
}

export type {
  FaqItem,
  FooterGroup,
  HomeContent,
  HomeContentBundle,
  IconCard,
  LanguageOption,
  Metric,
  NavigationLink,
  RoadmapPhase,
  TokenCard,
} from '~/home/content/types'

export { makeLanguageOptions } from '~/home/content/shared'
