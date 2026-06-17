import type { Locale } from '~/i18n/locales'
import { locales } from '~/i18n/locales'
import { homeMessagesByLocale } from '~/i18n/messages/home'
import { buildHomeContent } from './build-home-content'
import type { HomeContent } from './types'

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
} from './types'

export { makeLanguageOptions } from './shared'
