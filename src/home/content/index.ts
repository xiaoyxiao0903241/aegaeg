import type { Locale } from '../../i18n/locales'
import { locales } from '../../i18n/locales'
import { buildHomeContent } from './build-home-content'
import { enBundle } from './bundles/en'
import { esBundle } from './bundles/es'
import { jaBundle } from './bundles/ja'
import { koBundle } from './bundles/ko'
import { ruBundle } from './bundles/ru'
import { viBundle } from './bundles/vi'
import { zhBundle } from './bundles/zh'
import type { HomeContent, HomeContentBundle } from './types'

const bundles: Record<Locale, HomeContentBundle> = {
  en: enBundle,
  zh: zhBundle,
  ko: koBundle,
  ja: jaBundle,
  vi: viBundle,
  es: esBundle,
  ru: ruBundle,
}

export function getHomeContent(locale: Locale): HomeContent {
  return buildHomeContent(locale, bundles[locale])
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
  ResponsiveCopy,
  RoadmapPhase,
  TokenCard,
} from './types'

export { makeLanguageOptions } from './shared'
