import { allLanguageOptions, type Locale } from '../../i18n/locales'
import { withLocalePrefix } from '../../i18n/locale'
import { homeAssets } from '../assets'
import type { LanguageOption } from './types'

export const tokenCardShells = [
  {
    className: 'bg-token-usd1',
    icon: homeAssets.token.usd1Icon,
    shape: homeAssets.token.usd1Shape,
    shapeClassName: 'opacity-90',
    symbol: 'USD1',
  },
  {
    className: 'bg-token-agx',
    icon: homeAssets.token.agxIcon,
    iconClassName: 'scale-110',
    shape: homeAssets.token.agxShape,
    shapeClassName:
      '!right-[-10px] !bottom-0 !h-[124px] !w-[133px] opacity-20',
    symbol: 'AGX',
  },
  {
    className: 'bg-token-gagx',
    icon: homeAssets.token.gagxIcon,
    shape: homeAssets.token.gagxShape,
    shapeClassName: 'opacity-90',
    symbol: 'gAGX',
  },
  {
    className: 'bg-token-x',
    icon: homeAssets.token.xIcon,
    iconClassName: 'scale-110',
    shape: homeAssets.token.xShape,
    shapeClassName:
      '!right-0 !bottom-[11px] !h-[129px] !w-[136px] opacity-10',
    symbol: 'X',
  },
] as const

export const partners = [
  ['USD1', homeAssets.partners.usd1],
  ['BSC', homeAssets.partners.bsc],
  ['Ethereum', homeAssets.partners.ethereum],
  ['LayerZero', homeAssets.partners.layerZero],
  ['Chainlink', homeAssets.partners.chainlink],
  ['PancakeSwap', homeAssets.partners.pancakeSwap],
] as const

export const protocolIcons = [
  homeAssets.protocol.aiThinkTank,
  homeAssets.protocol.usd1,
  homeAssets.protocol.globalPayments,
] as const

export const engineIcons = [
  homeAssets.engine.marketMaker,
  homeAssets.engine.volatility,
  homeAssets.engine.rebase,
  homeAssets.engine.turbo,
] as const

export function makeLanguageOptions(activeLocale: Locale): LanguageOption[] {
  return allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === activeLocale,
    href: option.locale ? withLocalePrefix(option.locale, '/') : undefined,
  }))
}
