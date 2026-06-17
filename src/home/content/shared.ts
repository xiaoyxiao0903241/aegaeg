import { allLanguageOptions, type Locale } from '~/i18n/locales'
import { withLocalePrefix } from '~/i18n/locale'
import { homeAssets } from '~/home/assets'
import type { LanguageOption } from './types'

export const tokenCardShells = [
  {
    className: 'bg-token-agx',
    icon: homeAssets.token.agxIcon,
    shape: homeAssets.token.agxShape,
    shapeWrapClassName:
      'left-[56.54%] right-[-3.53%] top-[55%] bottom-[0.71%] opacity-20',
    shapeClassName: 'object-cover',
    symbol: 'AGX',
  },
  {
    className: 'bg-token-usd1',
    icon: homeAssets.token.usd1Icon,
    iconClassName: 'size-9 max-[820px]:size-[26px]',
    shape: homeAssets.token.usd1Shape,
    shapeWrapClassName: 'left-[133px] top-[130px] size-[170px]',
    symbol: 'USD1',
  },
  {
    className: 'bg-token-x',
    icon: homeAssets.token.xIcon,
    iconClassName: 'scale-110',
    shape: homeAssets.token.xShape,
    shapeWrapClassName:
      'left-[51.94%] right-0 top-[calc(50%+64.5px)] aspect-[584.8/553.8] -translate-y-1/2 opacity-10',
    shapeClassName: 'object-contain',
    symbol: 'X',
  },
  {
    className: 'bg-token-gagx',
    icon: homeAssets.token.gagxIcon,
    iconClassName: 'size-[34px] max-[820px]:size-[26px]',
    shape: homeAssets.token.gagxShape,
    shapeWrapClassName: 'left-[133px] top-[130px] size-[170px]',
    symbol: 'gAGX',
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
