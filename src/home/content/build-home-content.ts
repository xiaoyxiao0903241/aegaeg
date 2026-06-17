import type { Locale } from '~/i18n/locales'
import {
  engineIcons,
  makeLanguageOptions,
  partners,
  protocolIcons,
  tokenCardShells,
} from './shared'
import type { HomeContent, HomeContentBundle } from './types'

export function buildHomeContent(
  locale: Locale,
  bundle: HomeContentBundle,
): HomeContent {
  return {
    meta: bundle.meta,
    nav: {
      ...bundle.nav,
      languages: makeLanguageOptions(locale),
    },
    hero: bundle.hero,
    sections: {
      protocol: {
        ...bundle.sections.protocol,
        cards: bundle.sections.protocol.cards.map((card, index) => ({
          ...card,
          icon: protocolIcons[index],
        })),
      },
      engine: {
        ...bundle.sections.engine,
        cards: bundle.sections.engine.cards.map((card, index) => ({
          ...card,
          icon: engineIcons[index],
        })),
      },
      token: {
        ...bundle.sections.token,
        cards: bundle.sections.token.cards.map((card, index) => ({
          ...tokenCardShells[index],
          ...card,
        })),
      },
      roadmap: bundle.sections.roadmap,
      security: bundle.sections.security,
      partners: {
        title: bundle.sections.partners.title,
        items: partners,
      },
      faq: bundle.sections.faq,
    },
    metrics: bundle.metrics,
    footer: {
      ...bundle.footer,
      languages: makeLanguageOptions(locale),
    },
  }
}
