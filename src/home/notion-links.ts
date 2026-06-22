import type { Locale } from '~/i18n/locales'

const zhNotionLinks = {
  whitepaper: 'https://xdaoaegis.notion.site/37fdd8755b98809183dcdfb90e2c82ce',
  docs: 'https://xdaoaegis.notion.site/',
  economicModel: 'https://xdaoaegis.notion.site/37fdd8755b9880df8e5bc705e3438665',
} as const

const enNotionLinks = {
  whitepaper:
    'https://xdaoaegis.notion.site/Read-Whitepaper-V1-0-37fdd8755b988085a906cd5cb6ad5ee0',
  docs: 'https://xdaoaegis.notion.site/en',
  economicModel:
    'https://xdaoaegis.notion.site/Read-Economic-Model-Analysis-37fdd8755b98807282ede05961292be2',
} as const

export type HomeNotionLinkKey = keyof typeof zhNotionLinks

export function getHomeNotionLinks(locale: Locale) {
  return locale === 'zh' || locale === 'zht' ? zhNotionLinks : enNotionLinks
}

export function resolveHomeNotionLink(locale: Locale, key: HomeNotionLinkKey) {
  return getHomeNotionLinks(locale)[key]
}
