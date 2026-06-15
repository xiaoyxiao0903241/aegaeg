import { getHomeContent } from '../home/content'
import { localeLabels, locales, type Locale } from './locales'

function buildHomeCopy(locale: Locale): Record<string, string> {
  const content = getHomeContent(locale)
  const protocolLink = content.nav.links.find((link) => link.href === '#protocol')
  const engineLink = content.nav.links.find((link) => link.href === '#engine')
  const tokenLink = content.nav.links.find((link) => link.href === '#token')
  const roadmapLink = content.nav.links.find((link) => link.href === '#roadmap')
  const securityLink = content.nav.links.find((link) => link.href === '#security')
  const faqLink = content.nav.links.find((link) => link.href === '#faq')

  return {
    protocol: protocolLink?.label ?? 'Protocol',
    engine: engineLink?.label ?? 'Engine',
    token: tokenLink?.label ?? 'Token',
    roadmap: roadmapLink?.label ?? 'Roadmap',
    security: securityLink?.label ?? 'Security',
    faq: faqLink?.label ?? 'FAQ',
    whitepaper: content.nav.whitepaper,
    launchDapp: content.nav.launchDapp,
    enterProtocol: content.hero.enterProtocol,
    readWhitepaper: content.hero.readWhitepaper,
    language: localeLabels[locale],
  }
}

export const homeCopy = Object.fromEntries(
  locales.map((locale) => [locale, buildHomeCopy(locale)]),
) as Record<Locale, Record<string, string>>
